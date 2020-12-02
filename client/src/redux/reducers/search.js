import { SEARCH_RECIPES } from './../actions/types';

const initialState = {
    loading: false,
    input: null,
    recipes: null
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, actions) {
    const { type, payload } = actions

    switch(type) { 
        case SEARCH_RECIPES:
            return {
                loading: false,
                input: payload.q,
                recipes: payload.hits
            }
        default:
        return state;
    }
}