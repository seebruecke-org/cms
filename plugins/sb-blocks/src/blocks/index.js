import {
	registerBlockType,
	unstable__bootstrapServerSideBlockDefinitions as bootstrapServerSideBlockDefinitions,
} from '@wordpress/blocks';

import * as heading from './heading';

const BLOCKS = [ heading ];

export function registerBlocks() {
	BLOCKS.forEach( ( block ) => {
		const { name, metadata, settings } = block;

		// this needs to happen before registerBlockType()
		if ( metadata ) {
			// eslint-disable-next-line camelcase
			bootstrapServerSideBlockDefinitions( {
				[ name ]: metadata,
			} );
		}

		registerBlockType( name, settings );
	} );
}
