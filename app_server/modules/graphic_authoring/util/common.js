/**
 * Created by DISI on 03.03.14.
 */
exports.sortByOrderAsc = function compare(a,b) {
    if (a.userData.order < b.userData.order)
        return -1;
    if (a.userData.order > b.userData.order)
        return 1;
    return 0;
}

exports.sortByPosiAsc = function compare(a,b) {
    if(a.x && a.y && b.x && b.y){
        var posi1 = a.x + a.y * 10000;
        var posi2 = b.x + b.y * 10000;
        if (posi1 < posi2)
            return -1;
        if (posi1 > posi2)
            return 1;
        return 0;
    }else{
        return 0;
    }

}
