/// <reference path="./U____Main.ts" />

// eslint-disable-next-line no-unused-vars
namespace Ui_plugin_radio_gaga {
  
    class PrintField implements IPrintFunction {
        static uid = PrintProcessor.getFieldFunctionId(Plugin.config.field.fieldType);

        getGroup() { return PrintProcessor.FIELD_FUNCTION_TYPE }

        getHelp() { return `<h2>${Plugin.config.field.title}</h2>
    <p>Options</p>
    <pre>
       
    </pre>`;}
        getName() { return `${Plugin.config.field.title} field renderer`; }
           

        render(overwrites:IGlobalPrintFunctionParams,  paramsCaller:IPrintParams, itemOrFolderRef:string, itemOrFolder:JQuery, mf:JQuery, globals:IPrintGlobals, possibleTargets:string[],  onError:(message:string)=> void) {

            const defaults:IPrintParams = {
                class: ""
            }

            const params = ml.JSON.clone({...defaults, ...overwrites.customer[PrintField.uid], ...paramsCaller, ...overwrites.project[PrintField.uid], ...overwrites.section[PrintField.uid]});
            
            if (!paramsCaller.fieldInfo || !paramsCaller.fieldInfo.field) {
                onError( "called a field rendering function without passing a field");
                return "";
            }
            let config = <IPluginUi_plugin_radio_gagaFieldParameter>paramsCaller.fieldInfo.jsonConfig;
            let value = <IGaga>paramsCaller.fieldInfo.jsonValue;
            
            return Control.render( paramsCaller.fieldInfo.field.id, config, value, true, params );
        }
    }

    PrintProcessor.addFunction( PrintField.uid, new PrintField() );
}