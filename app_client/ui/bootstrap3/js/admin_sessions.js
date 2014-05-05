/**
 * Created by NONGHO on 08.11.13.
 */
$(document).ready(function(){
    $('#myModal').on('hidden.bs.modal', function () {
        $(this).removeData('bs.modal');
    });
    /*$('#myModal').delegate('a','click',function(e){
        e.preventDefault();
        var url = $(this).attr('href');

        $('#myModal .modal-body').load(url,function(e){

        });

     });*/
    $("#exampleGrid").simplePagingGrid({
        columnNames: ["Username", "Last Login Time", "Duration","Status","Action"],
        columnKeys: ["username", "lastLoginTime", "duration","isLoggedIn","userId"],
        sortable: [true, true, true,true],
        initialSortColumn: "lastLoginTime",
        dataUrl: "/admin/sessions/get",
        tableClass:'table table-striped table-bordered table-responsive',
        minimumVisibleRows:0,
        showLoadingOverlay:false,
        pageSize:20,
        sortOrder:'desc',
        cellTemplates:[
            null,
            null,
            null,
            '{{#if isLoggedIn}} <span class="label label-success">Online</span>{{else}}<span class="label label-warning">Offline</span>{{/if}}' ,
            '<a href="/admin/sessions/{{userId}}/view" class="btn btn-primary" data-toggle="modal" data-target="#myModal" data-refresh="true">View</a>'
        ]
    });

});