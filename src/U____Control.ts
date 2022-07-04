/// <reference path="./api/ControlCore.ts" />

// eslint-disable-next-line no-unused-vars
namespace Ui_plugin_radio_gaga{
    
   export class  U___Control extends ControlCore {
    
        /** an example / default configuration of a radio button list with two buttons */
        protected controlConfig : IPluginUi_plugin_radio_gagaFieldParameter = {
            options:[{id:"l00",text:"first option"},{id:"l01",text:"second option"}]
        };

        /** this method renders the radio buttons with the current selection, either readonly or as control  
         * @readOnly is set to true if the user cannot edit the data (e.g. in history or while printing
         * @params are can be parameter added by the printing configuration, to configure how something should be printed
        */
        protected renderControl( readOnly:boolean, params?:IPrintParams) {
           
            // this are the options saved in the field setting, configuring the control
            let config = <IPluginUi_plugin_radio_gagaFieldParameter>this.settings.parameter;

            // here, we get the options defining the radio buttons
            let options:IGagaOption[] = null;
            if (config && config.options) {
                // something has been saved, we take that
                options=config.options;
            } else if (this.controlConfig) {
                options=this.controlConfig.options;
            }
            
            if (!options || options.length==0) {
                return `field ${this.settings.fieldId} is not (properly) configured: no options are defined.`;
            }

            // get the actual value / default value
            let value = <IGaga>this.originalValue;
            let selected = "";
            // check if there is a value / and if not if there is a default value
            if (value) {
                // something has been saved
                selected =value.id?value.id:"";
            } else if (config.initialContent && config.initialContent.id) {
                selected = config.initialContent.id?config.initialContent.id:"";
            }

            // do the rendering
            if (readOnly) {
                return this.renderPrint( "" + this.settings.fieldId, selected, options,  params);
            } else {
                return this.renderEditor( "" + this.settings.fieldId,selected, options);
            }

        }
      
   
        /** method to call to initialize the editor, e.g. to attach handlers to checkboxes etc */
        initEditor(  ) {
            let that = this;

            // react on changes to the value. the ui will pass a call function which will enable/disable the save 
            $('input', this.editor).on( "change", () => {
                that.settings.valueChanged.apply(null);
            });
        }
        
        /** this method is called by the UI to figure out if the control's value changed */
        hasChanged():boolean {
            if (this.editor) {
                // read the value from the UI and parse it
                let current =  JSON.parse(this.getValue());
                // there was no value stored before || it changed
                return  !this.originalValue || current.id != (<IGaga>this.originalValue).id;
    
            } else {
                return false;
            }
        }
        
        /** this method is called by the UI to retrieve the string to be saved in the database */
        getValue():string {
            if (this.editor) {
                // convert the displayed value to a JSON string
                let checked = $('input:checked', this.editor).data("option");
                let current = <IGaga>{ id:checked };
                return JSON.stringify(current);
            } else {
                // nothing changed so we return exactly the same thing saved in the database
                return this.settings.fieldValue;
            }
        }
    
            
        /**  readonly printing for custom section, tooltip, zen or user without right to edit */
        protected renderPrint( fieldId:string, selected:string, options:IGagaOption[], params:IPrintParams) {
                    
            let rendered = `<span class='${(params && params.class)?params.class:""} ${fieldId?fieldId:""}'>`;
            for (let option of options) {
                let checked = option.id == selected;

                let left = checked?"&nbsp;":""; // history compare needs text changes -> move the space in/out of span
                let right = checked?"":"&nbsp;"; // history compare needs text changes -> move the space in/out of span
                
                rendered += `<div><span class="fal ${checked?"fa-check-circle":"fa-circle"}">${left}</span>${right}<span class="radioText">${option.text}</span><div>`;
            }
            rendered += "</span>";
            return rendered;   
        }

        /** interactive radio control */
        protected renderEditor(  fieldId:string, selected:string, options:IGagaOption[] ) {
        
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

    }

}