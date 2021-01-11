<?php

/**
 * Plugin Name: Seebrücke Blocks
 */

function init_blocks() {
  wp_register_script(
    "sb-blocks",
    plugins_url("build/index.js", __FILE__),
    ["wp-blocks", "wp-i18n", "wp-element", "wp-editor"],
    filemtime(plugin_dir_path(__FILE__) . "build/index.js"),
  );

  register_block_type("seebruecke/blocks", [
    "apiVersion" => 2,
    "editor_script" => "sb-blocks",
  ]);
}

add_action("init", "init_blocks");

?>
