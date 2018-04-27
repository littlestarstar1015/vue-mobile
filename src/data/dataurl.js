import axios from 'axios'
import {getToken} from './data-util';

//var urlPrefix = "//" + window.location.host + "/access/admin";
var urlPrefix = "http://192.168.1.215/access/admin";
var roomUrl = urlPrefix + "/room";
var loginUrl = urlPrefix + "/login";
var logoutUrl = urlPrefix + "/logout";


var ramanUrl = urlPrefix + "/material/";

/**
 * 加载这个中控室的配置.
 * @param  monitorId 中控室Id
 * @param callback 回调
 */
export function loadConfig(monitorId, callback) {

  axios.get(roomUrl, {
    params: {
      "token": getToken(),
      "roomid": monitorId
    }
  }).then(function(response) {
    callback(response.data[monitorId]);
  }).catch(function(err) {
    if (err.response && err.response.status === 400) {
      alert("请检查token参数是否正确");
    } else {
      console.log(JSON.stringify(err));
    }
  });

}

export function login(username, password, callback) {
  axios.get(loginUrl, {
    params: {
      "username": username,
      "password": password
    }
  }).then(function(response) {
    callback(true, response.data);
  }).catch(function(err) {
    callback(false, err.data);
  });
}

export function quit() {
  axios.post(logoutUrl, {
    params: {
      "token": getToken()
    }
  });
}
