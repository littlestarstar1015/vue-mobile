import {VIEW_MAIN, USER_TYPE_LINGDAO} from './const'

var token = null, servicePhone;
var rooms = {};

export function getToken() {
    if (token) {
        return token;
    }
}

export function getServicePhone() {
    return servicePhone;
}

export function getRooms() {
    return rooms;

}


/**
 * 根据设备型号获取初始化的数据。
 *
 * @param deviceModel
 * @returns
 */
export function cacheStationData(data) {
    sessionStorage.setItem("stations", JSON.stringify(data));    //存入数据
}

export function initData() {
    var data = {
        "view": VIEW_MAIN,
        "room": {
            "monitorPoints": null
        },
        activePoint: null
    }, authed;


    var stations = sessionStorage.getItem("stations");     //读取数据
    if (stations) {
        authed = JSON.parse(stations);
        data.area = authed.area;
        data.line = authed.line;
        data.user = authed.info;
        data.user.userType = authed.type;
        token = authed.securityKey;
        servicePhone = authed.phone;

        if (authed.type === USER_TYPE_LINGDAO) {
            collectRoomIds(data.area);
            collectRoomIds(data.line);
        }

        return data;
    }
}

function collectRoomIds(node) {
    if (!node) {
        return;
    }

    if (!!node.roomId) {
        rooms[node.roomId] = node.roomName;
    } else {
        for (var i = 0; i < node.children.length; i++) {
            collectRoomIds(node.children[i]);
        }
    }
}

