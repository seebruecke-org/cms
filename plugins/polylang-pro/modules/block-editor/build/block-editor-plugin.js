this["polylang-pro"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./modules/block-editor/js/block-editor-plugin.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./modules/block-editor/js/block-editor-plugin.js":
/*!********************************************************!*\
  !*** ./modules/block-editor/js/block-editor-plugin.js ***!
  \********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/url */ "@wordpress/url");
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_url__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _sidebar_settings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./sidebar/settings */ "./modules/block-editor/js/sidebar/settings.js");
/**
 * WordPress dependencies
 *
 * @package Polylang-Pro
 */




/**
 * External dependencies
 */


/**
 * Internal dependencies
 */


/*
 * Specific scripts with block editor
 */
_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default.a.use(
// phpcs:disable PEAR.Functions.FunctionCallSignature.Indent
function (options, next) {
	// If options.url is defined, this is not a REST request but a direct call to post.php for legacy metaboxes.
	if (Object(lodash__WEBPACK_IMPORTED_MODULE_3__["isUndefined"])(options.url)) {
		if (isSaveRequest(options)) {
			options.data.is_block_editor = true;
			if (!isCurrentPostRequest(options)) {
				options.data.lang = getCurrentLanguage();
			}
		} else {
			addLanguageToRequest(options);
			addIsBlockEditorToRequest(options);
		}
	}
	return next(options);
}
// phpcs:enable PEAR.Functions.FunctionCallSignature.Indent
);

/**
 * Is the request concerned the current post type ?
 *
 * Useful when saving a reusable block contained in another post type.
 * Indeed a reusable block is also a post, but its saving request doesn't concern the post currently edited.
 * As we don't know the language of the reusable block when the user triggers the reusable block saving action,
 * we need to pass the current post language to be sure that the reusable block will have a language.
 * @see https://github.com/polylang/polylang/issues/437 - Reusable block has no language when it's saved from another post type editing.
 *
 * @param {type} options the initial request
 * @returns {Boolean}
 */
function isCurrentPostRequest(options) {
	// Save translation datas is needed for all post types only
	// it's done by verifying options.path matches with one of baseURL of all post types
	// and compare current post id with this sent in the request

	// List of post type baseURLs.
	var postTypeURLs = Object(lodash__WEBPACK_IMPORTED_MODULE_3__["map"])(Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__["select"])('core').getEntitiesByKind('postType'), Object(lodash__WEBPACK_IMPORTED_MODULE_3__["property"])('baseURL'));

	// Id from the post currently edited.
	var postId = Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__["select"])('core/editor').getCurrentPostId();

	// Id from the REST request.
	// options.data never isNil here because it's already verified before in isSaveRequest() function
	var id = options.data.id;

	// Return true
	// if REST request baseURL matches with one of the known post type baseURLs
	// and the id from the post currently edited corresponds on the id passed to the REST request
	// Return false otherwise
	return -1 !== postTypeURLs.findIndex(function (element) {
		return new RegExp('' + Object(lodash__WEBPACK_IMPORTED_MODULE_3__["escapeRegExp"])(element)).test(options.path); // phpcs:ignore WordPress.WhiteSpace.OperatorSpacing.NoSpaceBefore, WordPress.WhiteSpace.OperatorSpacing.NoSpaceAfter
	}) && postId === id;
}

/**
 * Is the request for saving ?
 *
 * @param {type} options the initial request
 * @returns {Boolean}
 */
function isSaveRequest(options) {
	// If data is defined we are in a PUT or POST request method otherwise a GET request method
	// Test options.method property isn't efficient because most of REST request which use fetch API doesn't pass this property.
	// So, test options.data is necessary to know if the REST request is to save datas.
	// However test if options.data is undefined isn't sufficient because some REST request pass a null value as the ServerSideRender Gutenberg component.
	if (!Object(lodash__WEBPACK_IMPORTED_MODULE_3__["isNil"])(options.data)) {
		return true;
	} else {
		return false;
	}
}

/**
 * Add language to the request
 *
 * @param {type} options the initial request
 * @returns {undefined}
 */
function addLanguageToRequest(options) {
	var filterLang = Object(lodash__WEBPACK_IMPORTED_MODULE_3__["isUndefined"])(options.filterLang) || options.filterLang;
	if (filterLang) {
		options.path = Object(_wordpress_url__WEBPACK_IMPORTED_MODULE_2__["addQueryArgs"])(options.path, {
			lang: getCurrentLanguage()
		});
	}
}

/**
 * Get language from store and fallback in HTML
 *
 * @returns {Element.value}
 */
function getCurrentLanguage() {
	// for the first requests block editor isn't initialized yet
	// so language is getted from a HTML input
	var postLanguage = Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__["select"])(_sidebar_settings__WEBPACK_IMPORTED_MODULE_4__["MODULE_CORE_EDITOR_KEY"]).getEditedPostAttribute('lang');
	if (!Object(lodash__WEBPACK_IMPORTED_MODULE_3__["isUndefined"])(postLanguage) && postLanguage) {
		return postLanguage;
	}
	return pll_block_editor_plugin_settings.lang.slug;
}

/**
 * Add is_block_editor parameter to the request in a block editor context
 *
 * @param {type} options the initial request
 * @returns {undefined}
 */
function addIsBlockEditorToRequest(options) {
	options.path = Object(_wordpress_url__WEBPACK_IMPORTED_MODULE_2__["addQueryArgs"])(options.path, {
		is_block_editor: true
	});
}

/***/ }),

/***/ "./modules/block-editor/js/sidebar/settings.js":
/*!*****************************************************!*\
  !*** ./modules/block-editor/js/sidebar/settings.js ***!
  \*****************************************************/
/*! exports provided: MODULE_KEY, MODULE_CORE_KEY, MODULE_CORE_EDITOR_KEY, DEFAULT_STATE */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MODULE_KEY", function() { return MODULE_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MODULE_CORE_KEY", function() { return MODULE_CORE_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MODULE_CORE_EDITOR_KEY", function() { return MODULE_CORE_EDITOR_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_STATE", function() { return DEFAULT_STATE; });
/**
 * Module Constants
 *
 * @package Polylang-Pro
 */

var MODULE_KEY = 'pll/metabox';
var MODULE_CORE_EDITOR_KEY = 'core/editor';
var MODULE_CORE_KEY = 'core';
var DEFAULT_STATE = {
	languages: [],
	selectedLanguage: {},
	translatedPosts: {},
	fromPost: null
};


/***/ }),

/***/ "@wordpress/api-fetch":
/*!*******************************************!*\
  !*** external {"this":["wp","apiFetch"]} ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = this["wp"]["apiFetch"]; }());

/***/ }),

/***/ "@wordpress/data":
/*!***************************************!*\
  !*** external {"this":["wp","data"]} ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = this["wp"]["data"]; }());

/***/ }),

/***/ "@wordpress/url":
/*!**************************************!*\
  !*** external {"this":["wp","url"]} ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = this["wp"]["url"]; }());

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = this["lodash"]; }());

/***/ })

/******/ });