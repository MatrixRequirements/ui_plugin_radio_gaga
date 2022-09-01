/* Setting interfaces */

// eslint-disable-next-line no-unused-vars
namespace Ui_plugin_radio_gaga {


    /** Server setting for plugin.
    * 
    * This you can use to save setting on an instance level (for all projects)
    * The user can edit these in the admin through the Server Setting Page
    */
    export interface IServerSettings {
        /** Server Setting example */
        myServerSetting: string;
    }     
    
    /** Project setting for plugin
    * 
    * This you can use to save setting for one specific project.
    * The user can edit these in the admin through the Project Setting Page
    */
    export interface IProjectSettings {
        /** example of a project setting */
        myProjectSetting:string; 
    }


    /** Setting for custom fields 
    * 
    * These allow a user to add parameters to custom field defined by the plugin
    * each time it is added to a category
    */
    export interface IPluginUi_plugin_radio_gagaFieldParameter extends IFieldParameter {

        /** the definition of each line */
        options: IGagaOption[];
        /** to store the initial selected value */
        initialContent?:IGaga;
    }
    

    /** definition of one line of the control */
    export interface IGagaOption  {
        /**  id of the line should be 'l' and 2 digit number l00, l01, l02 */
        id: string;
        /**  display text in UI / documents */
        text: string;
    }


    /** Value stored in field 
    * 
    * This defines the value of the control as stored in the database
    */

    export interface IGaga extends IFieldValue {
        /** id of the selected option - if any */
        id: string;
        /** html for rendering in documents using xslt */
        html: string;
    }

    /** this allows to store parameters for printing 
    * 
    * This parameters can be overwritten in the layout and are used by the custom section printing
    */
    export interface IPrintParams extends IPrintFieldParams {
        class:string // default:"". additional class for outermost container
    }

}
