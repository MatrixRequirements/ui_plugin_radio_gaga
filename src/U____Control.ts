// eslint-disable-next-line no-unused-vars
namespace Ui_plugin_radio_gaga{

   export class  Control extends BaseControl {
    
        private settings: IControlOptions;
        private originalValue:string;
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
        
        // render the control with the current value
        createEditorFromDOM(currentValue:string, disabled:boolean): JQuery {
            if (this.settings.parameter.options.length == 0) {
                return $(`<div>No options defined<div> `);
            }
            let control = $(`<div>`);
            // get the name for the radio
            let name = "f" + this.settings.fieldId;
        
            // render all the lines (currently in the setting)    
            for( let option of this.settings.parameter.options) {  
                let checked = (option.id == currentValue)?"checked":"";

                control.append(`<div><label><input type="radio" data-option="${option.id}" ${disabled?"disabled":""} id="${name+option.id}" name="${name}" ${checked}> ${option.text}</label></div>`);            
            }
            return control;
        }
       
        constructor( control:JQuery) {
            super(control);
        } 
        
       
        init( options:IControlOptions ) {
            let that = this;

            // get (default) configuration + a field value
            this.settings = <IControlOptions> ml.JSON.mergeOptions(Control.defaultOptions, options);
            
            this.originalValue = "";

            // if it has been saved before get the value
            if (this.settings.fieldValue && (<IGaga>JSON.parse(this.settings.fieldValue)).id) {
                this.originalValue =  (<IGaga>JSON.parse(this.settings.fieldValue)).id;
            }

            // check if there's a default value which should be used
            let currentValue =  this.originalValue;

            // if there is no value saved, initialize it - if default is provided
            if (!currentValue && this.settings.parameter.initialContent && this.settings.parameter.initialContent.id) {
                currentValue = this.settings.parameter.initialContent.id;
            }

            // figure out if control should be editable
            let disabled = false;
            if ( // readonly display //
                this.settings.controlState === ControlState.Print || this.settings.controlState === ControlState.Tooltip|| this.settings.controlState === ControlState.HistoryView 
                || !this.settings.canEdit /* no rights to edit */
                || this.settings.parameter.readonly /* disabled in admin*/ ) {
                disabled = true;
            }
    
            // render the control
            this._root.append( super.createHelp(this.settings)); // render name of 
            const container = $("<div class='baseControl'>").appendTo( this._root ); // create a container
            this.editor = this.createEditorFromDOM(currentValue, disabled).appendTo( container ); // the actual UI
            
            // react on changes to the value. the ui will pass a call function which will enable/disable the save 
            $('input', this.editor).change(function() {
                that.settings.valueChanged.apply(null);
            });

        }
        
        /** this method is called by the UI to figure out if the control's value changed */
        hasChanged():boolean {
           
            let current = this.getValue();
            
            return  (<IGaga>JSON.parse(current)).id != this.originalValue;
        }
        
        /** this method is called by the UI to retrieve the string to be saved in the database */
        getValue():string {
            let checked = $('input:checked', this.editor).data("option");
            let current = <IGaga>{ id:checked };
            return JSON.stringify(current);
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