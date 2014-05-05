var domainMeta = {
    domain: "metamodel",
    domainId: "dbb35f7c-b91d-e1a3-513c-46f476f5272e",
    domainTitle: "dumy data",
    description: "This is a demo model"

};
var representations =
    [
        {
            "type": "App.draw.node.Phase",
            "id": "38413ef3-2b12-3db2-d0a2-e1861e20c4b7",
            "x": 50,
            "y": 150,
            "width": 60,
            "height": 60,
            "userData": {
                "label": {
                    "text": "problem_engagement"
                }
            }
        },
        {
            "type": "App.draw.node.Activity",
            "id": "0e20ada8-a136-bfe2-a483-6026ec7148a2",
            "x": 231,
            "y": 177,
            "width": 50,
            "height": 50,
            "userData": {
                "label": {
                    "text": "act_introduce_problem"
                }
            }
        },
        {
            "type": "App.draw.node.Activity",
            "id": "24198c4e-b507-47cd-f67d-7c6729fe6c16",
            "x": 230,
            "y": 300,
            "width": 50,
            "height": 50,
            "userData": {
                "label": {
                    "text": "act_analyze"
                }
            }
        },
        {
            "type": "App.draw.node.Resource",
            "id": "6d54668d-2279-d377-dbf3-60e52540d496",
            "x": 430,
            "y": 200,
            "width": 50,
            "height": 50,
            "userData": {
                "label": {
                    "text": "res_problem_source"
                }
            }
        },
        {
            "type": "App.draw.node.Artifact",
            "id": "0242fd24-f1be-0d49-fc51-6d6b8849a4db",
            "x": 430,
            "y": 300,
            "width": 50,
            "height": 50,
            "userData": {
                "label": {
                    "text": "art_analysis_report"
                }
            }
        },
        {
            "type": "draw2d.shape.note.PostIt",
            "id": "1f3b2f37-4592-4e44-b691-6b038fc1fc5d",
            "x": 10,
            "y": 10,
            "width": 200,
            "height": 25,
            "userData": null,
            "radius": 5,
            "text": "Phase: problem_engagement",
            "fontSize": 14,
            "fontColor": "#FFFFFF",
            "fontFamily": null
        },
        {
            "type": "App.draw.node.Activity",
            "id": "d5617524-3c9e-d8ae-acd7-04c19c57a9c4",
            "x": 230,
            "y": 77,
            "width": 50,
            "height": 50,
            "userData": {
                "label": {
                    "text": "unnamed"
                }
            }
        },
        {
            "type": "App.draw.node.Artifact",
            "id": "96368138-ab33-bf5f-5632-23160077856f",
            "x": 430,
            "y": 379,
            "width": 50,
            "height": 50,
            "userData": {
                "label": {
                    "text": "unnamed"
                }
            }
        },
        {
            "type": "App.draw.node.Resource",
            "id": "922623c7-5966-8891-950c-d3078bed92ab",
            "x": 426,
            "y": 77,
            "width": 50,
            "height": 50,
            "userData": {
                "label": {
                    "text": "unnamed"
                }
            }
        },
        {
            "type": "draw2d.Connection",
            "id": "c4992b14-511a-757b-7738-5f723e61bc65",
            "userData": null,
            "cssClass": "stroke",
            "stroke": 1,
            "color": "#1B1B1B",
            "source": {
                "node": "38413ef3-2b12-3db2-d0a2-e1861e20c4b7",
                "port": "output0"
            },
            "target": {
                "node": "0e20ada8-a136-bfe2-a483-6026ec7148a2",
                "port": "input0"
            },
            "router": "draw2d.layout.connection.SplineConnectionRouter"
        },
        {
            "type": "draw2d.Connection",
            "id": "208569ed-3bcd-7d87-3139-86c0dc797e6d",
            "userData": null,
            "cssClass": "stroke",
            "stroke": 1,
            "color": "#1B1B1B",
            "source": {
                "node": "38413ef3-2b12-3db2-d0a2-e1861e20c4b7",
                "port": "output0"
            },
            "target": {
                "node": "24198c4e-b507-47cd-f67d-7c6729fe6c16",
                "port": "input0"
            },
            "router": "draw2d.layout.connection.SplineConnectionRouter"
        },
        {
            "type": "draw2d.Connection",
            "id": "6b4f80c4-11bf-35ad-d998-254401e98c8d",
            "userData": null,
            "cssClass": "stroke",
            "stroke": 1,
            "color": "#1B1B1B",
            "source": {
                "node": "24198c4e-b507-47cd-f67d-7c6729fe6c16",
                "port": "output0"
            },
            "target": {
                "node": "6d54668d-2279-d377-dbf3-60e52540d496",
                "port": "input0"
            },
            "router": "draw2d.layout.connection.SplineConnectionRouter"
        },
        {
            "type": "draw2d.Connection",
            "id": "06d4b363-3cf7-a8ec-77aa-25257d91f4b4",
            "userData": null,
            "cssClass": "stroke",
            "stroke": 1,
            "color": "#1B1B1B",
            "source": {
                "node": "24198c4e-b507-47cd-f67d-7c6729fe6c16",
                "port": "output0"
            },
            "target": {
                "node": "0242fd24-f1be-0d49-fc51-6d6b8849a4db",
                "port": "input0"
            },
            "router": "draw2d.layout.connection.SplineConnectionRouter"
        },
        {
            "type": "draw2d.Connection",
            "id": "79de1f3d-bf68-8de6-a2ec-12b547a7bf95",
            "userData": null,
            "cssClass": "stroke",
            "stroke": 1,
            "color": "#1B1B1B",
            "source": {
                "node": "24198c4e-b507-47cd-f67d-7c6729fe6c16",
                "port": "output0"
            },
            "target": {
                "node": "96368138-ab33-bf5f-5632-23160077856f",
                "port": "input0"
            },
            "router": "draw2d.layout.connection.SplineConnectionRouter"
        },
        {
            "type": "draw2d.Connection",
            "id": "886d3f33-7912-9d9b-6e83-91d2f9b209e2",
            "userData": null,
            "cssClass": "stroke",
            "stroke": 1,
            "color": "#1B1B1B",
            "source": {
                "node": "d5617524-3c9e-d8ae-acd7-04c19c57a9c4",
                "port": "output0"
            },
            "target": {
                "node": "922623c7-5966-8891-950c-d3078bed92ab",
                "port": "input0"
            },
            "router": "draw2d.layout.connection.SplineConnectionRouter"
        },
        {
            "type": "draw2d.Connection",
            "id": "03a40d19-e67e-fca3-27a8-fd2061bcc7bf",
            "userData": null,
            "cssClass": "stroke",
            "stroke": 1,
            "color": "#1B1B1B",
            "source": {
                "node": "38413ef3-2b12-3db2-d0a2-e1861e20c4b7",
                "port": "output0"
            },
            "target": {
                "node": "d5617524-3c9e-d8ae-acd7-04c19c57a9c4",
                "port": "input0"
            },
            "router": "draw2d.layout.connection.SplineConnectionRouter"
        },
        {
            "type": "draw2d.Connection",
            "id": "ae411150-2b9d-75b6-ce49-e18023a59b6c",
            "userData": null,
            "cssClass": "stroke",
            "stroke": 1,
            "color": "#1B1B1B",
            "source": {
                "node": "0e20ada8-a136-bfe2-a483-6026ec7148a2",
                "port": "output0"
            },
            "target": {
                "node": "0242fd24-f1be-0d49-fc51-6d6b8849a4db",
                "port": "input0"
            },
            "router": "draw2d.layout.connection.SplineConnectionRouter"
        }
    ];
var treeStore = Ext.create('Ext.data.TreeStore', {
    root: {
        expanded: true,
        children: [
            {text: "app", children: [
                {leaf: true, text: "Application.js"}
            ]},
            {text: "button", expanded: true, children: [
                {leaf: true, text: "Button.js"},
                {leaf: true, text: "Cycle.js"},
                {leaf: true, text: "Split.js"}
            ]},
            {text: "container", children: [
                {leaf: true, text: "ButtonGroup.js"},
                {leaf: true, text: "Container.js"},
                {leaf: true, text: "Viewport.js"}
            ]},
            {text: "core", children: [
                {text: "dom", children: [
                    {leaf: true, text: "Element.form.js"},
                    {leaf: true, text: "Element.static-more.js"}
                ]}
            ]},
            {text: "dd", children: [
                {leaf: true, text: "DD.js"},
                {leaf: true, text: "DDProxy.js"},
                {leaf: true, text: "DDTarget.js"},
                {leaf: true, text: "DragDrop.js"},
                {leaf: true, text: "DragDropManager.js"},
                {leaf: true, text: "DragSource.js"},
                {leaf: true, text: "DragTracker.js"},
                {leaf: true, text: "DragZone.js"},
                {leaf: true, text: "DragTarget.js"},
                {leaf: true, text: "DragZone.js"},
                {leaf: true, text: "Registry.js"},
                {leaf: true, text: "ScrollManager.js"},
                {leaf: true, text: "StatusProxy.js"}
            ]},
            {text: "core", children: [
                {leaf: true, text: "Element.alignment.js"},
                {leaf: true, text: "Element.anim.js"},
                {leaf: true, text: "Element.dd.js"},
                {leaf: true, text: "Element.fx.js"},
                {leaf: true, text: "Element.js"},
                {leaf: true, text: "Element.position.js"},
                {leaf: true, text: "Element.scroll.js"},
                {leaf: true, text: "Element.style.js"},
                {leaf: true, text: "Element.traversal.js"},
                {leaf: true, text: "Helper.js"},
                {leaf: true, text: "Query.js"}
            ]},
            {leaf: true, text: "Action.js"},
            {leaf: true, text: "Component.js"},
            {leaf: true, text: "Editor.js"},
            {leaf: true, text: "Img.js"},
            {leaf: true, text: "Layer.js"},
            {leaf: true, text: "LoadMask.js"},
            {leaf: true, text: "ProgressBar.js"},
            {leaf: true, text: "Shadow.js"},
            {leaf: true, text: "ShadowPool.js"},
            {leaf: true, text: "ZIndexManager.js"}
        ]}});
