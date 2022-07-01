// eslint-disable-next-line no-unused-vars
namespace Ui_plugin_radio_gaga{
    
   export class  Control extends BaseControl {
    
        private settings: IControlOptions;
        private originalValue:IGaga;
        private editor:JQuery;
       
        static defaultOptions:IControlOptions = {
            placeholder: "",
            controlState: ControlState.FormView, // read only rendering
            canEdit: false, // whether data can be edited 
            dummyData: false, // fill control with a dummy text (for form design...)
            valueChanged: () => console.debug("Value has changed"), // callback to call if value changes
            parameter: {
                readonly: false, // can be set to overwrite the default readonly status
                allowResize: true, // allow to resize control
                hideFullscreen:false, //  hide fullscreen
                // add other default values
                options:[{id:"l00",text:"first option"},{id:"l01",text:"second option"}]
            }
        };
        
        /** this method renders the radio buttons with the current selection, either readonly or as control  */
        static render(fieldId:string, config:IPluginUi_plugin_radio_gagaFieldParameter, value:IGaga, readOnly:boolean, params?:IPrintParams) {
           
            // get the options defining the radio buttons
            let options:IGagaOption[] = null;
            if (config && config.options) {
                options=config.options;
            } else if (Control.defaultOptions.parameter.options) {
                options=Control.defaultOptions.parameter.options;
            }
            
            if (!options || options.length==0) {
                return `field ${fieldId} is not (properly) configured: no options are defined.`;
            }

            // get the actual value / default value
            let selected = "";
            // check if there is a value / and if not if there is a default value
            if (value) {
                selected = value.id?value.id:"";
            } else if (config.initialContent && config.initialContent.id) {
                selected = value.id?value.id:"";
            }

            // do the rendering
            if (readOnly) {
                return this.renderPrint( fieldId, options, selected, params);
            } else {
                return this.renderEditor( fieldId, options, selected);
            }

        }

        /**  readonly printing for custom section, tooltip, zen or user without right to edit */
        static renderPrint(fieldId:string, options:IGagaOption[], selected:string, params:IPrintParams) {
            
            
            let rendered = `<span class='${(params && params.class)?params.class:""} ${fieldId?fieldId:""}'>`;
            for (let option of options) {
                let checked = option.id == selected;
                rendered += `<div><span class="fal ${checked?"fa-check-circle":"fa-circle"}"></span>&nbsp;<span class="radioText">${option.text}</span><div>`;
            }
            rendered += "</span>";
            return rendered;   
        }
        /** interactive radio control */
        static renderEditor(fieldId:string, options:IGagaOption[], selected:string ) {
                 
            let editor = "<div>";
            editor += "</div>";
            // get the name for the radio
            let name = "f" + fieldId;
        
            // render all the lines (currently in the setting)    
            for( let option of options) {  
                let checked = (option.id == selected)?"checked":"";

                editor += `<div><label><input type="radio" data-option="${option.id}" id="${name+option.id}" name="${name}" ${checked}> ${option.text}</label></div>`;            
            }
            return editor;
            
        }

        
       
        constructor( control:JQuery) {
            super(control);
        } 
        
       
        init( options:IControlOptions ) {
            let that = this;

            // get (default) configuration + a field value
            this.settings = <IControlOptions> ml.JSON.mergeOptions(Control.defaultOptions, options);
            
            // if it has been saved before get the value - if not remember null
            this.originalValue = this.settings.fieldValue? JSON.parse(this.settings.fieldValue):null;

            // render the control header and the container for the control
            this._root.append( super.createHelp(this.settings)); // render name of 
            const container = $("<div class='baseControl'>").appendTo( this._root ); // create a container

            // figure out if control should be editable
            if ( this.settings.controlState === ControlState.Print || this.settings.controlState === ControlState.Tooltip|| this.settings.controlState === ControlState.HistoryView 
                || !this.settings.canEdit /* no rights to edit */
                || this.settings.parameter.readonly /* disabled in admin*/ ) {

                // readonly display //

                $( Control.render(""+this.settings.fieldId, this.settings.parameter, this.originalValue, false, null)).appendTo( container );
            } else {
    
                this.editor = $( Control.render(""+this.settings.fieldId, this.settings.parameter, this.originalValue, false, null)).appendTo( container ); // the actual UI
                
                // react on changes to the value. the ui will pass a call function which will enable/disable the save 
                $('input', this.editor).change(function() {
                    that.settings.valueChanged.apply(null);
                });
            }
        }
        
        /** this method is called by the UI to figure out if the control's value changed */
        hasChanged():boolean {
            if (this.editor) {
                // read the value from the UI and parse it
                let current =  JSON.parse(this.getValue());
                // there was no value stored before || it changed
                return  !this.originalValue || current.id != this.originalValue.id;
    
            } else {
                return false;
            }
        }
        
        /** this method is called by the UI to retrieve the string to be saved in the database */
        getValue():string {
            if (this.editor) {
                let checked = $('input:checked', this.editor).data("option");
                let current = <IGaga>{ id:checked };
                return JSON.stringify(current);
            } else {
                return this.settings.fieldValue;
            }
        }
    
        refresh() {
           console.log("Refresh has been called");
        }
        setValue(newValue:string, reset?:boolean) {
            console.log("this could be called from the outside to force a change of value");
        }
    
        destroy () {
            if ( this.editor ) {
                this.editor = null;
            }
        }
        
       resizeItem() {
           console.log("resizeItem has been called");
        }
    
    
    }

}