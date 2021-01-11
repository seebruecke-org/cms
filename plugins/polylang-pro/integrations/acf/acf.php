<?php
/**
 * @package Polylang-Pro
 */

/**
 * Manages compatibility with Advanced Custom Fields Pro
 * Version tested 5.8.3
 *
 * @since 2.0
 */
class PLL_ACF {
	/**
	 * Instance of PLL_ACF_Sync_Metas
	 *
	 * @var object
	 */
	public $sync_metas;

	/**
	 * Instance of PLL_ACF_Auto_Translate
	 *
	 * @var object
	 */
	public $auto_translate;

	/**
	 * Initializes filters for ACF
	 *
	 * @since 2.0
	 */
	public function init() {
		add_filter( 'acf/get_taxonomies', array( $this, 'get_taxonomies' ) );

		add_action( 'add_meta_boxes_acf-field-group', array( $this, 'remove_sync' ) );
		add_action( 'add_meta_boxes_acf-field-group', array( $this, 'duplicate_field_group' ) );
		add_filter( 'acf/duplicate_field/type=clone', array( $this, 'duplicate_clone_field' ) );

		add_filter( 'acf/location/rule_match/page_type', array( $this, 'rule_match_page_type' ), 20, 3 ); // After ACF.

		add_filter( 'pll_get_post_types', array( $this, 'get_post_types' ), 10, 2 );
		add_filter( 'pll_bulk_translate_post_types', array( $this, 'bulk_translate_post_types' ) );

		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );

		add_action( 'wp_ajax_acf_post_lang_choice', array( $this, 'acf_post_lang_choice' ) );

		$this->sync_metas     = new PLL_ACF_Sync_Metas();
		$this->auto_translate = new PLL_ACF_Auto_Translate();
	}

	/**
	 * Prevents ACF to display our private taxonomies
	 *
	 * @since 2.8
	 *
	 * @param array $taxonomies Taxonomy names.
	 * @return array
	 */
	public function get_taxonomies( $taxonomies ) {
		return array_diff( $taxonomies, get_taxonomies( array( '_pll' => true ) ) );
	}

	/**
	 * Deactivate synchronization for ACF field groups
	 *
	 * @since 2.1
	 */
	public function remove_sync() {
		foreach ( pll_languages_list() as $lang ) {
			remove_action( "pll_before_post_translation_{$lang}", array( PLL()->sync_post->buttons[ $lang ], 'add_icon' ) );
		}
	}

	/**
	 * Duplicate the field group if content duplication is activated
	 *
	 * @since 2.3
	 *
	 * @param object $post Current post object
	 */
	public function duplicate_field_group( $post ) {
		if ( PLL()->model->is_translated_post_type( 'acf-field-group' ) && 'post-new.php' === $GLOBALS['pagenow'] && isset( $_GET['from_post'], $_GET['new_lang'] ) ) {
			// Capability check already done in post-new.php.
			check_admin_referer( 'new-post-translation' );

			$duplicate_options = get_user_meta( get_current_user_id(), 'pll_duplicate_content', true );

			$active = ! empty( $duplicate_options ) && ! empty( $duplicate_options['acf-field-group'] );

			if ( $active ) {
				acf_duplicate_field_group( (int) $_GET['from_post'], $post->ID );
			}
		}
	}

	/**
	 * Recursively searches a field by its name in an array of fields
	 *
	 * @since 2.3
	 *
	 * @param string $name   Field name.
	 * @param array  $fields An array of fields.
	 * @return string Field key, empty string if not found.
	 */
	protected function search_field_by_name( $name, $fields ) {
		foreach ( $fields as $field ) {
			if ( $name === $field['name'] ) {
				return $field['key'];
			} elseif ( ! empty( $field['sub_fields'] ) && $key = $this->search_field_by_name( $name, $field['sub_fields'] ) ) {
				return $key;
			} elseif ( ! empty( $field['layouts'] ) ) {
				foreach ( $field['layouts'] as $layout ) {
					if ( ! empty( $layout['sub_fields'] ) && $key = $this->search_field_by_name( $name, $layout['sub_fields'] ) ) {
						return $key;
					}
				}
			}
		}
		return '';
	}

	/**
	 * Translates a clone field when creating a new field group translation
	 *
	 * @since 2.3
	 *
	 * @param array $field ACF Custom field.
	 * @return array
	 */
	public function duplicate_clone_field( $field ) {
		if ( PLL()->model->is_translated_post_type( 'acf-field-group' ) && ! empty( $field['clone'] ) && 'post-new.php' === $GLOBALS['pagenow'] && isset( $_GET['from_post'], $_GET['new_lang'] ) ) {
			check_admin_referer( 'new-post-translation' );

			foreach ( $field['clone'] as $k => $selector ) {
				if ( acf_is_field_group_key( $selector ) ) {
					// Can't use acf_get_field_group() as it is filtered by language.
					$posts = get_posts(
						array(
							'post_type'              => 'acf-field-group',
							'post_status'            => array( 'publish', 'acf-disabled', 'trash' ),
							'name'                   => $selector,
							'update_post_meta_cache' => false,
							'lang'                   => '',
						)
					);

					if ( ! empty( $posts ) && $tr_id = pll_get_post( $posts[0]->ID, sanitize_key( $_GET['new_lang'] ) ) ) {
						$tr_group = acf_get_field_group( $tr_id );

						$field['clone'][ $k ] = $tr_group['key'];
					}
				} elseif ( acf_is_field_key( $selector ) ) {
					$_field    = acf_get_field( $selector );
					$ancestors = get_post_ancestors( $_field['ID'] );
					$group_id  = end( $ancestors );

					if ( $tr_id = pll_get_post( $group_id, sanitize_key( $_GET['new_lang'] ) ) ) {
						$tr_fields = acf_get_fields( $tr_id );

						if ( $key = $this->search_field_by_name( $_field['name'], $tr_fields ) ) {
							$field['clone'][ $k ] = $key;
						}
					}
				}
			}
		}
		return $field;
	}

	/**
	 * Allow page on front and page for posts translations to match the corresponding page type
	 *
	 * @since 2.0
	 *
	 * @param bool  $match  Whether a location matches the rule.
	 * @param array $rule   Field group location rule.
	 * @param array $screen Information on the current location.
	 * @return bool
	 */
	public function rule_match_page_type( $match, $rule, $screen ) {
		if ( ! empty( $screen['post_id'] ) ) {
			$post = get_post( $screen['post_id'] );

			if ( 'front_page' === $rule['value'] && $front_page = (int) get_option( 'page_on_front' ) ) {
				$translations = pll_get_post_translations( $front_page );

				if ( '==' === $rule['operator'] ) {
					$match = in_array( $post->ID, $translations );
				} elseif ( '!=' === $rule['operator'] ) {
					$match = ! in_array( $post->ID, $translations );
				}
			} elseif ( 'posts_page' === $rule['value'] && $posts_page = (int) get_option( 'page_for_posts' ) ) {
				$translations = pll_get_post_translations( $posts_page );

				if ( '==' === $rule['operator'] ) {
					$match = in_array( $post->ID, $translations );
				} elseif ( '!=' === $rule['operator'] ) {
					$match = ! in_array( $post->ID, $translations );
				}
			}
		}

		return $match;
	}

	/**
	 * Add the Field Groups post type to the list of translatable post types
	 *
	 * @since 2.0
	 *
	 * @param array $post_types  List of post types.
	 * @param bool  $is_settings True when displaying the list of custom post types in Polylang settings.
	 * @return array
	 */
	public function get_post_types( $post_types, $is_settings ) {
		if ( $is_settings ) {
			$post_types['acf-field-group'] = 'acf-field-group';
		}
		return $post_types;
	}

	/**
	 * Remove the Field Groups post type from the bulk translate action.
	 *
	 * @since 2.8.4
	 *
	 * @param array $types List of post type names for which Polylang manages the bulk translate.
	 * @return array
	 */
	public function bulk_translate_post_types( $types ) {
		return array_diff( $types, array( 'acf-field-group' ) );
	}

	/**
	 * Enqueues javascript to react to a language change in the post metabox
	 *
	 * @since 2.0
	 */
	public function admin_enqueue_scripts() {
		global $pagenow, $typenow;

		if ( in_array( $pagenow, array( 'post.php', 'post-new.php' ) ) && ! in_array( $typenow, array( 'acf-field-group', 'attachment' ) ) && PLL()->model->is_translated_post_type( $typenow ) ) {
			$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
			wp_enqueue_script( 'pll_acf', plugins_url( '/js/acf' . $suffix . '.js', __FILE__ ), array( 'acf-input' ), POLYLANG_VERSION );
		}
	}

	/**
	 * Ajax response for changing the language in the post metabox
	 *
	 * @since 2.0
	 */
	public function acf_post_lang_choice() {
		check_ajax_referer( 'pll_language', '_pll_nonce' );

		if ( isset( $_POST['fields'] ) ) {
			$x = new WP_Ajax_Response();
			foreach ( array_map( 'sanitize_key', $_POST['fields'] ) as $field ) {
				ob_start();
				acf_render_field_wrap( acf_get_field( $field ), 'div', 'label' );
				$x->Add( array( 'what' => str_replace( '_', '-', $field ), 'data' => ob_get_contents() ) );
				ob_end_clean();
			}

			$x->send();
		}
	}
}
