<?php
/**
 * @package Polylang-Pro
 */

/**
 * A trait to implement the duplicate action.
 *
 * @since 2.8
 */
trait PLL_Duplicate_Trait {
	/**
	 * Reference to the plugin options.
	 *
	 * @var array
	 */
	protected $options;

	/**
	 * Reference to the PLL_Sync_Content instance.
	 *
	 * @var PLL_Sync_Content
	 */
	protected $ync_content;

	/**
	 * Tells whether the button is active or not
	 *
	 * @since 2.1
	 *
	 * @return bool
	 */
	public function is_active() {
		global $post;
		$duplicate_options = get_user_meta( get_current_user_id(), 'pll_duplicate_content', true );
		return isset( $duplicate_options[ $post->post_type ] ) ? $duplicate_options[ $post->post_type ] : false;
	}

	/**
	 * Saves the button state
	 *
	 * @since 2.1
	 *
	 * @param string $post_type Current post type.
	 * @param bool   $active    New requested button state.
	 * @return bool Whether the new button state is accepted or not.
	 */
	protected function toggle_option( $post_type, $active ) {
		$duplicate_options = get_user_meta( get_current_user_id(), 'pll_duplicate_content', true );
		if ( ! is_array( $duplicate_options ) ) {
			$duplicate_options = array( $post_type => $active );
		} else {
			$duplicate_options[ $post_type ] = $active;
		}
		return update_user_meta( get_current_user_id(), 'pll_duplicate_content', $duplicate_options );
	}

	/**
	 * Fires the content copy
	 *
	 * @since 2.5
	 */
	public function new_post_translation() {
		global $post;
		static $done = false;

		if ( ! $done && 'post-new.php' === $GLOBALS['pagenow'] && isset( $_GET['from_post'], $_GET['new_lang'] ) ) {
			check_admin_referer( 'new-post-translation' );

			$duplicate_options = get_user_meta( get_current_user_id(), 'pll_duplicate_content', true );
			$this->active      = ! empty( $duplicate_options ) && ! empty( $duplicate_options[ $post->post_type ] );

			if ( $this->active ) {
				$done = true; // Avoid a second duplication in the block editor.

				// Capability check already done in post-new.php.
				$this->sync_content->copy_content( get_post( (int) $_GET['from_post'] ), $post, sanitize_key( $_GET['new_lang'] ) );

				// Maybe duplicates the featured image.
				if ( $this->options['media_support'] ) {
					add_filter( 'pll_translate_post_meta', array( $this->sync_content, 'duplicate_thumbnail' ), 10, 3 );
				}

				// Maybe duplicate terms.
				add_filter( 'pll_maybe_translate_term', array( $this->sync_content, 'duplicate_term' ), 10, 3 );
			}
		}
	}
}
