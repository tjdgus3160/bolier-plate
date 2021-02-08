import {combineReducers} from 'redux';
import user from './user_reducer';

// 각각의 reducer를 root에서 하나로 합쳐줌
const rootReducer = combineReducers({
    user
});

export default rootReducer;