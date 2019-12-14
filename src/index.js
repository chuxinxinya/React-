import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './redux/store'
import App from './App';

ReactDOM.render(
<Provider store={store}>  {/*省略消息订阅与发布 */}
  <BrowserRouter>
    <App/>
  </BrowserRouter>
</Provider>
, document.getElementById('root'));
