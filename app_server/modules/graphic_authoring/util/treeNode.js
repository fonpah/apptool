/**
 * User: DISI
 * Date: 11.08.13
 * Time: 20:19
 */


exports.cvtMetaDomainToLeftNode = function (doc) {
    if (doc)
        var leftNode = {
            leaf: true,
            id: 'tNode_' + doc.id,
            domainId: doc.id,
            domainType: doc.type,
            modelLevel: 'metaModel',
            text: doc.title,
            qtip: doc.userData.description
        };
    return leftNode;
}

exports.cvtDomainToLeftNode = function (doc) {
    if (doc)
        var leftNode = {
            leaf: true,
            id: 'tNode_' + doc.id,
            domainId: doc.id,
            domainType: doc.type,
            modelLevel: 'coursePlan',
            text: doc.title,
            qtip: doc.userData.description
        };
    return leftNode;
}

exports.cvtMetaDomainToFolderNode = function (doc) {
    if (doc)
        var folderNode = {
            id: 'tFolder_' + doc.id,
            domainId: doc.id,
            domainType: doc.type,
            text: doc.title,
            qtip: doc.userData.description,
            expanded: false,
            children: []
        };
    return folderNode;
}

var cvtDomainToNode = exports.cvtDomainToNode = function (doc) {
    var node;
    node = {
        leaf: !doc.hasSubDomain,
        id: 'tNode_' + (doc.bindingId ? doc.bindingId : doc.id),
        modelLevel: doc.modelLevel,
        isSysMM: doc.isSysMM,
        lang: doc.lang,
        docId: doc.docId,
        domainId: doc.id,
        domainType: doc.type,
        elemType: doc.entityType, // only for elements
        bindingId: doc.bindingId, // only for elements
        text: doc.title,
        qtip: doc.userData.description,
        expanded: doc.expanded

    };
    return node;
}

exports.cvtDocsToNodes = function (docs) {
    var nodes = [];
    if(docs){
        for (var i = 0; i < docs.length; i++) {
            nodes.push(cvtDomainToNode(docs[i]));
        }
    }
    return nodes;
}

exports.cvtMetaElemToLeftNode = function (doc) {
    if (doc)
        var leftNode = {
            leaf: true,
            modelLevel: 'metaModel',
            id: 'tNode_' + doc.bindingId,
            elemType: doc.entityType,
            bindingId: doc.bindingId,
            text: doc.title,
            qtip: doc.userData.description
        };
    return leftNode;
}