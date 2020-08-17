var IntegrationAPI;
(function (IntegrationAPI) {
    function addToRecyclerBlacklist(id) {
        recyclerBlacklist.push(id);
    }
    IntegrationAPI.addToRecyclerBlacklist = addToRecyclerBlacklist;
    function addToolBooxValidItem(id) {
        toolbox_items.push(id);
    }
    IntegrationAPI.addToolBooxValidItem = addToolBooxValidItem;
})(IntegrationAPI || (IntegrationAPI = {}));
