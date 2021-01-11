/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { textAlign, content, level, kicker } = attributes;
	const TagName = 'h' + level;

	const className = classnames( {
		[ `has-text-align-${ textAlign }` ]: textAlign,
	} );

	return (
		<TagName { ...useBlockProps.save( { className } ) }>
			{ kicker && <small>{ kicker }</small> }

			<span>
				<RichText.Content value={ content } />
			</span>
		</TagName>
	);
}
