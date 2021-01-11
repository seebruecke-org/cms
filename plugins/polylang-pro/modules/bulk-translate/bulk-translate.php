<?php
/**
 * @package Polylang-Pro
 */

/**
 * A class to bulk translate posts
 * Currently only support duplicate and synchronization
 *
 * @since 2.4
 */
class PLL_Bulk_Translate {

	const RESULTS = 'data';
	const ERROR = 'error';
	const WARNING = 'notice-warning';
	const UPDATED = 'updated';

	/**
	 * Holds a reference to a {@see PLL_Model_Admin} instance
	 *
	 * @since 2.4
	 *
	 * @var PLL_Admin_Model
	 */
	protected $model;

	/**
	 * Reference to the current WP_Screen object
	 *
	 * @since 2.7
	 *
	 * @var WP_Screen
	 */
	protected $current_screen;

	/**
	 * Stores the results of the bulk action when it's done
	 *
	 * @since 2.7
	 *
	 * @var array
	 */
	protected $results;

	/**
	 * PLL_Bulk_Translate constructor.
	 *
	 * @since 2.4
	 *
	 * @param PLL_Model $model Shared instance of the current PLL_Model.
	 */
	public function __construct( $model ) {
		$this->model = $model;

		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
	}

	/**
	 * Enqueues script and style.
	 *
	 * @since 2.8
	 */
	public function admin_enqueue_scripts() {
		$screen = get_current_screen();

		if ( in_array( $screen->base, array( 'edit', 'upload' ) ) ) {
			$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
			wp_enqueue_script(
				'pll_bulk_translate',
				plugins_url( '/js/bulk-translate' . $suffix . '.js', __FILE__ ),
				array( 'jquery', 'wp-ajax-response' ),
				POLYLANG_VERSION,
				1
			);

			wp_enqueue_style(
				'pll_bulk_translate',
				plugins_url( '/css/bulk-translate' . $suffix . '.css', __FILE__ ),
				array(),
				POLYLANG_VERSION
			);
		}
	}

	/**
	 * References the options for the bulk action
	 *
	 * @since 2.7
	 *
	 * @var array {
	 *    string => PLL_Bulk_Translate_Options[]
	 * }
	 */
	protected $options = array();

	/**
	 * A reference to the array of available options for the current screen
	 *
	 * @since 2.7
	 *
	 * @var array PLL_Bulk_Translate_Options[]
	 */
	protected $available_options;

	/**
	 * Registers options of the Translate bulk action
	 *
	 * @since 2.7
	 *
	 * @param PLL_Bulk_Translate_Option[] $options An array of {@see PLL_Bulk_Translate_Option} to register.
	 */
	public function register_options( $options ) {
		if ( ! is_array( $options ) ) {
			$options = array( $options );
		}

		foreach ( $options as $option ) {
			if ( array_key_exists( $option->get_name(), $this->options ) ) {
				if ( WP_DEBUG ) {
					trigger_error( // phpcs:ignore WordPress.PHP.DevelopmentFunctions
						sprintf(
							'Error when trying to register Bulk Translate option with name \'%s\' : an option with this name already exists.',
							esc_attr( $option->get_name() )
						)
					);
				}
				continue;
			}
			$this->options[ $option->get_name() ] = $option;
		}
	}

	/**
	 * Add actions and filters
	 *
	 * Verifies the post type is allowed for translation and that the post status isn't 'trashed'
	 *
	 * @since 2.4
	 * @since 2.7 hooked on 'current_screen' and takes the screen as parameter
	 *
	 * @param WP_Screen $current_screen Instance of the current WP_Screen.
	 *
	 * @return bool False if error occurs in order to fail silently.
	 */
	public function init( $current_screen ) {

		/**
		 * Filter the list of post types enabling the bulk translate
		 *
		 * @since 2.4
		 *
		 * @param array $post_types List of post types
		 */
		$post_types = apply_filters( 'pll_bulk_translate_post_types', $this->model->get_translated_post_types() );

		// phpcs:ignore WordPress.Security.NonceVerification
		if ( ! in_array( $current_screen->post_type, $post_types ) || ( array_key_exists( 'post_status', $_GET ) && 'trash' === $_GET['post_status'] ) ) {
			return false;
		}

		$this->options = array_filter(
			$this->options,
			function ( $option ) {
				return $option->is_available();
			}
		);

		$this->current_screen = $current_screen;

		if ( ! empty( $this->options ) ) {
			add_filter( "bulk_actions-{$current_screen->id}", array( $this, 'add_bulk_action' ) );
			add_action( "handle_bulk_actions-{$current_screen->id}", array( $this, 'handle_bulk_action' ), 10, 2 );
			add_action( 'admin_footer', array( $this, 'display_form' ) );
			add_action( 'admin_notices', array( $this, 'display_notices' ) );
			// Special case where the wp_redirect() happens before the ulk action is trigerred
			if ( 'edit' === $current_screen->base ) {
				add_action( 'wp_redirect', array( $this, 'parse_request_before_redirect' ) );
			}
		}
	}

	/**
	 * Retrieves the needed data in the request body and sanitize it
	 *
	 * @since 2.7
	 *
	 * @param array $request Parameters from the HTTP Request.
	 *
	 * @return array
	 */
	protected function parse_request( $request ) {
		$screens_content_keys = array(
			'upload' => 'media',
			'edit'    => 'post',
		);
		$item_key = $screens_content_keys[ $this->current_screen->base ];

		$filters = array(
			$item_key            => array(
				'filter'        => FILTER_VALIDATE_INT,
				'flags'         => FILTER_REQUIRE_ARRAY,
				'error_message' => __( 'No item has been selected. Please make sure to select at least one item to be translated.', 'polylang-pro' ),
			),
			'translate'          => array(
				'filter' => FILTER_SANITIZE_STRING,
			),
			'pll-translate-lang' => array(
				'filter'        => FILTER_SANITIZE_STRING,
				'flags'         => FILTER_REQUIRE_ARRAY,
				'error_message' => __( 'Error: No target language has been selected. Please make sure to select at least one target language.', 'polylang-pro' ),
			),
		);

		$args = filter_var_array(
			$request,
			$filters,
			true
		);
		$args['item_ids'] = $args[ $item_key ];

		$args[ self::ERROR ] = array();
		foreach ( $filters as $field_name => $filter_details ) {
			if ( empty( $args[ $field_name ] ) && array_key_exists( 'error_message', $filter_details ) ) {
				$args[ self::ERROR ][] = $filter_details['error_message'];
			}
		}

		return $args;
	}

	/**
	 * Handle the Translate bulk action
	 *
	 * @since 2.4
	 * @since 2.7 Use a transient to store notices.
	 *
	 * @param string $sendback The URL to redirect to, with parameters.
	 * @param string $action   Name of the requested bulk action.
	 *
	 * @return string The URL to redirect to.
	 */
	public function handle_bulk_action( $sendback, $action ) {
		if ( 'pll_translate' === $action ) {
			check_admin_referer( 'pll_translate', '_pll_translate_nonce' );

			$query_args = $this->parse_request( $_GET );

			if ( empty( $query_args[ self::ERROR ] ) ) {

				$selected_option = $this->options[ $query_args['translate'] ];

				$data = $selected_option->do_bulk_action( $query_args['item_ids'], $query_args['pll-translate-lang'] );

			} else {
				$data = $query_args;
			}

			if ( is_array( $data ) ) {
				$notices = array_filter(
					$data,
					function( $key ) {
						return in_array( $key, array( self::ERROR, self::WARNING, self::UPDATED ) );
					},
					ARRAY_FILTER_USE_KEY
				);
				// Notices are displayed after a wp_redirect, which will re-instantiate all our classes.
				if ( ! empty( $notices ) ) {
					set_transient( 'pll_bulk_translate', $data );
				}
			}
		}
		return $sendback;
	}

	/**
	 * Add a bulk action
	 *
	 * @since 2.4
	 *
	 * @param array $actions List of bulk actions.
	 *
	 * @return array
	 */
	public function add_bulk_action( $actions ) {
		$actions['pll_translate'] = __( 'Translate', 'polylang-pro' );
		return $actions;
	}

	/**
	 * Displays the Bulk translate form
	 *
	 * @since 2.4
	 */
	public function display_form() {
		global $post_type; // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		$bulk_translate_options = $this->options;
		usort(
			$bulk_translate_options,
			function ( $first_element, $second_element ) {
				return $first_element->get_priority() - $second_element->get_priority();
			}
		);
		include __DIR__ . '/view-bulk-translate.php';
	}

	/**
	 * Displays the notices if some have been registered.
	 *
	 * Because WordPress triggers a {@see wp_redirect()}, these notices are stored in a transient.
	 *
	 * @since 2.7
	 */
	public function display_notices() {
		$notice_types = array(
			self::ERROR   => 'error',
			self::WARNING => 'notice-warning',
			self::UPDATED => 'updated',
		);

		$results = get_transient( 'pll_bulk_translate' );
		if ( ! empty( $results ) ) {

			$count = 0;
			foreach ( array_intersect_key( $results, $notice_types ) as $type => $notices ) {
				foreach ( $notices as $message ) {
					$count++;
					add_settings_error(
						'pll-translate',
						'pll-translate-' . $count,
						$message,
						$type
					);
				}
			}

			settings_errors( 'pll-translate', true );

			delete_transient( 'pll_bulk_translate' );
		}
	}

	/**
	 * Fixes the case when no post is selected and a redirect is fired before we can handle the bulk action.
	 *
	 * @since 2.7
	 *
	 * @param string $sendback The destination URL.
	 *
	 * @return string
	 */
	public function parse_request_before_redirect( $sendback ) {
		// Nonce is already verified in edit.php.
		// phpcs:disable WordPress.Security.NonceVerification.Recommended
		if ( array_key_exists( 'action', $_GET ) && 'pll_translate' === $_GET['action'] ) {
			$data = $this->parse_request( $_GET );
			// phpcs:enable

			if ( ! empty( $data['translate'] ) && ! empty( $data[ self::ERROR ] ) && false === get_transient( 'pll_bulk_translate' ) ) {
				set_transient( 'pll_bulk_translate', array( self::ERROR => $data[ self::ERROR ] ) );
			}
		}

		return $sendback;
	}
}
