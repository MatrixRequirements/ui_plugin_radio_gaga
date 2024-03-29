// eslint-disable-next-line no-unused-vars
namespace Ui_plugin_radio_gaga  {
    
    /** base interface for field value */
    export interface IFieldValue { /* empty by design */ }
    
    /** Description of the current plugin. Each feature can be activated/deactivated using the configuration object */
    export interface IPluginConfig {
        /** Field. This will add a new field type that can be used for data rendering in the main app */
        field: IPluginFeatureField ,
        /** Menu tool item. This will add a new menu item in the tools menu  in the main app.*/
        menuToolItem: IPluginFeatureBase,
        /** Menu tool item. This will add a new dashboard in the main app.*/
        dashboard: IPluginFeatureDashboard,

        /** Customer setting page parameter. This will add a page in the server config in the adminConfig */
        customerSettingsPage: IPluginFeature<IServerSettings>,
        /** project setting page parameter. This will add a page per project in the adminConfig */
        projectSettingsPage: IPluginFeature<IProjectSettings>,
    }

    export interface IPluginFeatureBase{
        /** Whether to show the page */
        enabled: boolean
        /** Id of the page in the tree/url */
        id?: string,
        /** Title of the page in the tree and of the page when displayed */
        title?: string;
    }
    
    export interface IPluginFeature<T> extends IPluginFeatureBase {
        /** Setting name that's used by REST api to persist settings */
        settingName: string,
        /** Default settings when nothing has been save yet*/
        defaultSettings?: T,
        /** Optional help text shown under the title */
        help?: string,
        /** Optional URL describing this page */
        helpUrl?:string
    }

    export interface IPluginFeatureDashboard extends IPluginFeatureBase {
        /** Icon of the dashboard (See font awesome) */
        icon: string,
        /** Parent of the dashboard (It should exists)) */
        parent: string
        /** Whether using filter when searching.*/
        usefilter: boolean,
        /** Order in the tree */
        order:number,
    }

    export interface IPluginFeatureField extends IPluginFeatureBase {
        /**  Field type id that will be use when rendering the data */
        fieldType: string,
        /**  description of  field  capabilities*/
        fieldConfigOptions: IFieldDescription
    }


    export interface IPluginSettingPage<T> {
        renderSettingPage?: () => void,
        showAdvanced?: () => void,
        showSimple?: () => void,
        getSettingsDOM?: (_setting?:T) => JQuery,
        settings?: T,
        saveAsync?: () => JQueryDeferred<unknown>,
        paramChanged?:()=>void,
        settingsOriginal?: T,
        settingsChanged?:T,
        getProject?: () => string,
        pageId?:string,
        initPage?: (_title: string, _showAdvancedBtn: boolean, _showDeleteText: string, _help: string, _externalHelp?: string, _showCopy?: boolean) => void
        showAdvancedCode?:(_code:string, _success:(_code:string) => void, _semanticValidate?:IValidationSpec) =>void
  
     }


    export abstract class PluginCore implements IPlugin {

      
        /* DON'T CHANGE ANYTHING BELOW UNLESS YOU KNOW WHAT YOU ARE DOING */

        /** if false the plugin will not be loaded (for debugging) */
        public isDefault = true;

        /** can be overwritten by plugin to enable or disable functionality based on what is selected/configured */
        protected enabledInContext = true;


        constructor() {
            console.debug(`Constructing ${Plugin.PLUGIN_NAME}`);
            this.initPrinting();
        }

        // ------------------------------------------------ initialization calls  ------------------------------------------------    

        initProject(project:string) {
            this.onInitProject(project);
        }
        // to be overwritten
        abstract onInitProject(project:string); 
        

        initItem(_item: IItem, _jui: JQuery) {
            
            this.onInitItem(_item);
        }
        // to be overwritten
        abstract onInitItem(_item: IItem);


        // ------------------------------------------------ item menu ------------------------------------------------

        protected enableToolMenu(ul: JQuery, _hook: number) {
            return this.enabledInContext;
        }
        
        // by default plugins add none or one item to the tool menu of displayed items. This class can be overwritten if needed
        updateMenu(ul: JQuery, hook: number) {
            // et alors?
        }

        // ------------------------------------------------ control (fields) implementation ------------------------------------------------
        
        protected enableControl(fieldType:string) {
            return this.enabledInContext;
        }

        // this method is called to see if a plugin defines or overwrites a field type
        supportsControl(fieldType: string): boolean {
            return this.enableControl(fieldType) &&  fieldType == Plugin.config.field.fieldType && Plugin.config.field.enabled;
        }

        // this method calls the content of the Control function
        createControl(ctrlObj: JQuery, settings: IBaseControlOptions) {
            if (settings && settings.fieldType == Plugin.config.field.fieldType &&  Plugin.config.field.enabled){
                const baseControl = new U___Control(ctrlObj);
                ctrlObj.getController = () => {
                    return baseControl;
                };
                baseControl.init(<IControlOptions>settings);
            }
        }

        getFieldConfigOptions(): IFieldDescription[] {
            return [
                Plugin.config.field.fieldConfigOptions
            ];
        }

        initPrinting() {
            /* add the function unless in admin client where PrintProcessor is undefined*/
            if ( Plugin.config.field.enabled && typeof(PrintProcessor) != "undefined") {
                PrintProcessor.addFunction(  PrintProcessor.getFieldFunctionId(Plugin.config.field.fieldType), new U___Control() );
            }
        }

        // ------------------------------------------------ project setting page ------------------------------------------------
        protected enableProjectSetting() {
            return this.enabledInContext;
        }
        getProjectSettingPages(): ISettingPage[] {
            return []
        }
        

        // ------------------------------------------------ server settings page  ------------------------------------------------
       
        protected enableServerSetting() {
            return this.enabledInContext;
        }

        getCustomerSettingPages(): ISettingPage[] {
            return []
        }

         // ------------------------------------------------ project dashboard / or folder dashboard  ------------------------------------------------
       
         protected enableDashboard() {
            return this.enabledInContext;
        }

        getProjectPages(): IProjectPageParam[] {
            const pages: IProjectPageParam[] = [];
          
            return pages;
        }


        // ------------------------------------------------ plugin description (used by CI) ------------------------------------------------
        
        
        static PLUGIN_NAME = "<PLUGIN_NAME_PLACEHOLDER>";
        static PLUGIN_VERSION = "<PLUGIN_VERSION_PLACEHOLDER>";

        getPluginName() {
            return Plugin.PLUGIN_NAME;
        }

        getPluginVersion() {
            return Plugin.PLUGIN_VERSION;
        }

    }
}