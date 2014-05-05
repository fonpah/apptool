/**
 * User: DISI
 * Date: 30.07.13
 * Time: 11:38
 */

exports.getAllSets = function (representations) {
    var sets = {};
    sets.phases = [];
    sets.activites = [];
    sets.resources = [];
    sets.tools = [];
    sets.actors = [];
    sets.artifacts = [];
    sets.environments = [];
    sets.simBindings = [];
    sets.connections = [];
    var element;
    for (var i = 0; i < representations.length; i++) {
        element = representations[i];
        if (element.entityType === 'phase') {
            sets.phases.push(element);
        }else if(element.entityType === 'activity'){
            sets.activites.push(element);
        }else if(element.entityType === 'resource'){
            sets.resources.push(element);
        }else if(element.entityType === 'tool'){
            sets.tools.push(element);
        }else if(element.entityType === 'actor'){
            sets.actors.push(element);
        }else if(element.entityType === 'artifact'){
            sets.artifacts.push(element);
        }else if(element.entityType === 'environment'){
            sets.environments.push(element);
        }else if(element.entityType === 'simBinding'){
            sets.simBindings.push(element);
        }else if(element.entityType === 'connection'){
            sets.connections.push(element);
        }
    }

    return sets;
}
