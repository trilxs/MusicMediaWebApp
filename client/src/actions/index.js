import axios from 'axios';
import { FETCH_USER } from './types';

/* ACTION CREATOR ENDPOINTS */
export var fetchUser = () => {
    return async function(dispatch) {
        var res = await axios.get('/api/current_user')
        dispatch({ type : FETCH_USER, payload: res.data }); // res.data is the User model. We dispatch an action.
    };
};


/* NON-ACTION CREATOR ENDPOINTS */
/* Param1 (values): our workflowForm key under the redux-form reducer
   Param2 (history): helps navigate to /dashboard */
export var submitWorkflow = (formData, history) => {
    return async function(dispatch) {
        // Insert or update the user model to the backend
        

        // Upon a successful workflow set up, redirect to the dashboard
        history.push('/dashboard');
    }
}