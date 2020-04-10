import { id } from './id.js';

// props for custom inputs
export const input = {
    props: {
        ...id.props,

        name: {
            type: String,
            default: '',
        },
    },

    computed: {
        cInputProps() {
            return {
                id: this.id,
                name: this.name,
            };
        },
    },
};
