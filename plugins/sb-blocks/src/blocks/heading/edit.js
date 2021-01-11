/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';
import {
	AlignmentToolbar,
	BlockControls,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { ToolbarGroup, PanelBody, TextControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import HeadingLevelDropdown from './heading-level-dropdown';

function HeadingEdit( {
	attributes,
	setAttributes,
	mergeBlocks,
	onReplace,
	mergedStyle,
} ) {
	const { textAlign, content, level, placeholder, kicker } = attributes;
	const tagName = 'h' + level;
	const Tag = tagName;
	const blockProps = useBlockProps( {
		className: classnames( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
		style: mergedStyle,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<TextControl
						label={ __( 'Kicker' ) }
						value={ kicker }
						onChange={ ( nextKicker ) => {
							setAttributes( { kicker: nextKicker } );
						} }
					/>
				</PanelBody>
			</InspectorControls>

			<BlockControls>
				<ToolbarGroup>
					<HeadingLevelDropdown
						selectedLevel={ level }
						onChange={ ( newLevel ) =>
							setAttributes( { level: newLevel } )
						}
					/>
				</ToolbarGroup>
				<AlignmentToolbar
					value={ textAlign }
					onChange={ ( nextAlign ) => {
						setAttributes( { textAlign: nextAlign } );
					} }
				/>
			</BlockControls>

			<Tag { ...blockProps }>
				{ kicker && <small>{ kicker }</small> }

				<RichText
					identifier="content"
					tagName="div"
					value={ content }
					onChange={ ( value ) =>
						setAttributes( { content: value } )
					}
					onMerge={ mergeBlocks }
					onSplit={ ( value ) => {
						if ( ! value ) {
							return createBlock( 'core/paragraph' );
						}

						return createBlock( 'core/heading', {
							...attributes,
							content: value,
						} );
					} }
					onReplace={ onReplace }
					onRemove={ () => onReplace( [] ) }
					aria-label={ __( 'Heading text' ) }
					placeholder={ placeholder || __( 'Write heading…' ) }
					textAlign={ textAlign }
				/>
			</Tag>
		</>
	);
}

export default HeadingEdit;
