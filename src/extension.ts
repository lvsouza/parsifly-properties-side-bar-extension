import { ExtensionBase, View, FormProvider } from 'parsifly-extension-base';

// Envs.DEBUG = true;


new class Extension extends ExtensionBase {

  propertiesView = new View({
    key: 'properties-side-bar',
    dataProvider: new FormProvider({
      key: 'properties-data-provider',
      getFields: async () => {
        return [];
      },
    }),
  });


  async activate() {
    console.log('EXTENSION: Activating');

    this.application.views.register(this.propertiesView);

    await this.application.commands.editor.showSecondarySideBarByKey('properties-side-bar');
  }

  async deactivate() {
    console.log('EXTENSION: Deactivating');

    this.application.views.unregister(this.propertiesView);
  }
};
