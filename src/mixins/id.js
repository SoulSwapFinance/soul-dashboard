import shortid from 'shortid';

// id prop, default value is auto generated
export const id = {
    props: {
        id: {
            type: String,
            default: shortid.generate(),
        },
    },
};
