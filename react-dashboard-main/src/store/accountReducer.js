// action - state management
import { ACCOUNT_INITIALIZE, LOGIN, LOGOUT } from './actions';

export const initialState = {
    token: '',
    isLoggedIn: false,
    isInitialized: false,
    user: null,
    is_staff: false,
    is_superuser: false
};

//-----------------------|| ACCOUNT REDUCER ||-----------------------//

const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACCOUNT_INITIALIZE: {
            const { isLoggedIn, user, token, is_staff, is_superuser } = action.payload;
            return {
                ...state,
                isLoggedIn,
                isInitialized: true,
                token,
                user,
                is_staff,
                is_superuser
            };
        }
        case LOGIN: {
            const { user } = action.payload;
            return {
                ...state,
                isLoggedIn: true,
                user
            };
        }
        case LOGOUT: {
            return {
                ...state,
                isLoggedIn: false,
                token: '',
                user: null,
                is_staff: false,
                is_superuser: false
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default accountReducer;
