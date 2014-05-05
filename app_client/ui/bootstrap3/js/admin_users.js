/**
 * Created by NONGHO on 08.11.13.
 */
$(document).ready(function(){
    $('#myModal').on('hidden.bs.modal', function () {
        $(this).removeData('bs.modal');
    });
    $('#superPassword').on('hidden.bs.modal', function () {
        $(this).removeData('bs.modal');
    });
    $("#exampleGrid").simplePagingGrid({
        columnNames: ["Username", "Status", "Domain","Pwd Reset Req","Created At","Action"],
        columnKeys: ["username", "verified", "userDomain","passwordResetRequested","createdAt","_id"],
        sortable: [true, true, true,true,true],
        initialSortColumn: "createdAt",
        dataUrl: "/admin/users/get",
        tableClass:'table table-striped table-bordered table-responsive',
        minimumVisibleRows:0,
        showLoadingOverlay:false,
        pageSize:20,
        sortOrder:'desc',
        cellTemplates:[
            null,
            '{{#if verified}} <span class="label label-success">Verified</span>{{else}}<span class="label label-warning">Not Verified</span>{{/if}}' ,
            null,
            '{{#if passwordResetRequested}} <span class="label label-warning">Yes</span>{{else}}<span class="label label-info">No</span>{{/if}}' ,
            null,
            '<div class="btn-group"> <a href="/admin/users/{{_id}}/view" class="btn btn-primary" data-toggle="modal" data-target="#myModal" data-refresh="true">View</a><a href="/admin/password/{{_id}}/master" class="btn btn-primary" data-toggle="modal" data-target="#superPassword" data-refresh="true">Master Password</a></div>'
        ]
    });

});