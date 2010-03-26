(function () {

var Paginator = YAHOO.widget.Paginator,
    l         = YAHOO.lang;

/**
 * ui Component to generate the jump-to-page dropdown
 *
 * @namespace YAHOO.widget.Paginator.ui
 * @class JumpToPageDropdown
 * @for YAHOO.widget.Paginator
 *
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
Paginator.ui.JumpToPageDropdown = function (p) {
    this.paginator = p;

    p.subscribe('rowsPerPageChange',this.rebuild,this,true);
    p.subscribe('rowsPerPageOptionsChange',this.rebuild,this,true);
    p.subscribe('pageChange',this.update,this,true);
    p.subscribe('totalRecordsChange',this.rebuild,this,true);
    p.subscribe('destroy',this.destroy,this,true);

    // TODO: make this work
    //p.subscribe('rowsPerPageDropdownClassChange',this.rebuild,this,true);
};

/**
 * Decorates Paginator instances with new attributes. Called during
 * Paginator instantiation.
 * @method init
 * @param p {Paginator} Paginator instance to decorate
 * @static
 */
Paginator.ui.JumpToPageDropdown.init = function (p) {



    /**
     * CSS class assigned to the select node
     * @attribute jumpToPageDropdownClass
     * @default 'yui-pg-jtp-options'
     */
    p.setAttributeConfig('jumpToPageDropdownClass', {
        value : 'yui-pg-jtp-options',
        validator : l.isNumber
    });
};

Paginator.ui.JumpToPageDropdown.prototype = {

    /**
     * select node
     * @property select
     * @type HTMLElement
     * @private
     */
    select  : null,



    /**
     * Generate the select and option nodes and returns the select node.
     * @method render
     * @param id_base {string} used to create unique ids for generated nodes
     * @return {HTMLElement}
     */
    render : function (id_base) {
        this.select = document.createElement('select');
        this.select.id        = id_base + '-jtp';
        this.select.className = this.paginator.get('jumpToPageDropdownClass');
        this.select.title = 'Jump to page';

        YAHOO.util.Event.on(this.select,'change',this.onChange,this,true);

        this.rebuild();

        return this.select;
    },

    /**
     * (Re)generate the select options.
     * @method rebuild
     */
    rebuild : function (e) {
        var p       = this.paginator,
            sel     = this.select,
            numPages = p.getTotalPages(),
            opt,cfg,val,i,len;

        this.all = null;

        for (i = 0, len = numPages; i < len; ++i ) {
            opt = sel.options[i] ||
                  sel.appendChild(document.createElement('option'));

            opt.innerHTML = i + 1;

            opt.value = i + 1;


        }

        for ( i = numPages, len = sel.options.length ; i < len ; i++ ) {
            sel.removeChild(sel.lastChild);
        }

        this.update();
    },

    /**
     * Select the appropriate option if changed.
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {

        if (e && e.prevValue === e.newValue) {
            return;
        }

        var cp      = this.paginator.getCurrentPage()+'',
            options = this.select.options,
            i,len;

        for (i = 0, len = options.length; i < len; ++i) {
            if (options[i].value === cp) {
                options[i].selected = true;
                break;
            }
        }
    },

    /**
     * Listener for the select's onchange event.  Sent to setPage method.
     * @method onChange
     * @param e {DOMEvent} The change event
     */
    onChange : function (e) {
        this.paginator.setPage(
                parseInt(this.select.options[this.select.selectedIndex].value,false));
    },



    /**
     * Removes the select node and clears event listeners
     * @method destroy
     * @private
     */
    destroy : function () {
        YAHOO.util.Event.purgeElement(this.select);
        this.select.parentNode.removeChild(this.select);
        this.select = null;
    }
};







/**
 * ui component to allow selection of all rows
 * Extends RowsPerPageDropdown
 *
 * If you set your rowsPerPage to something like 
 * rowsPerPageOptions : [5,10,25,50,"all"]
 * this will allow select all.
 */
 
 
 /**
  * First we need an extra method on the Paginator itself
  */
 
 /**
  * @var whether all rows are currently showing
  */
 Paginator.prototype._showingAllRows=false;

 /**
  * Setter
  */
 Paginator.prototype.setShowingAllRows=function(d){
    if(YAHOO.lang.isBoolean(d)){
       this._showingAllRows=d;
    }
 };

 /**
  * Getter
  */
 Paginator.prototype.getShowingAllRows=function(){
    return this._showingAllRows;
 };
 

 Paginator.prototype.getRowsPerPageAll=function(d){
   if(d===true && this.getShowingAllRows()===true){
     return"all";
   }
   return this.getRowsPerPage();
 }; 
 
 
 
 /**
  * Now the paginator ui itself
  *
  */
 
 Paginator.ui.RowsPerPageDropdownAll = function(p){
    
    Paginator.ui.RowsPerPageDropdownAll.superclass.constructor.call(this,p);
    p.subscribe("rowsPerPageChange",this.updatePaginatorShowingAllRows,this,true);
 };


 /**
  * And extend:
  */
 l.extend(Paginator.ui.RowsPerPageDropdownAll,
          Paginator.ui.RowsPerPageDropdown,
          {
            _allSelected:false,
            
            updatePaginatorShowingAllRows:function(d,e){
               e.paginator.setShowingAllRows(this.getAllSelected());
            },
            
            onChange:function(d){
               if(this.select.options[this.select.selectedIndex].text=="all"){
                  this._allSelected=true;
               } else {
                  this._allSelected=false;
               }
            
               Paginator.ui.RowsPerPageDropdownAll.superclass.onChange.call(this,d);
            
            },
            
            getAllSelected:function(){
              return this._allSelected;
            }
  }
 );






/**
 * ui Component to generate a total num rows ui
 *
 * @namespace YAHOO.widget.Paginator.ui
 * @class TotalRows
 * @for YAHOO.widget.Paginator
 *
 * @constructor
 * @param p {Pagintor} Paginator instance to attach to
 */
Paginator.ui.TotalRows = function (p) {
    this.paginator = p;

    p.subscribe('totalRecordsChange',this.update,this,true);
    p.subscribe('destroy',this.destroy,this,true);


};

/**
 * Decorates Paginator instances with new attributes. Called during
 * Paginator instantiation.
 * @method init
 * @param p {Paginator} Paginator instance to decorate
 * @static
 */
Paginator.ui.TotalRows.init = function (p) {



    /**
     * CSS class assigned to the select node
     * @attribute jumpToPageDropdownClass
     * @default 'yui-pg-jtp-options'
     */
    p.setAttributeConfig('totalRowsClass', {
        value : 'yui-pg-totalrows',
        validator : l.isNumber
    });
};

Paginator.ui.TotalRows.prototype = {


    el: null,


    /**
     * Generate the select and option nodes and returns the select node.
     * @method render
     * @param id_base {string} used to create unique ids for generated nodes
     * @return {HTMLElement}
     */
    render : function (id_base) {
        var p = this.paginator, el;
        
        el = document.createElement( 'span' );
        el.className = p.get('totalRowsClass');
        el.id        = id_base + '-totalrows';
        el.title     = 'Total number of records';
        el.innerHTML = p.getTotalRecords();
        this.el = el;
        
        return el;
    },


    /**
     * Select the appropriate option if changed.
     * @method update
     * @param e {CustomEvent} The calling change event
     */
    update : function (e) {

        this.el.innerHTML = this.paginator.getTotalRecords();
    },



    /**
     * Removes the select node and clears event listeners
     * @method destroy
     * @private
     */
    destroy : function () {
        this.el.parentNode.removeChild(this.el);
        this.el = null;
    }
};
})();