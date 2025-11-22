import { ExtensionBase, View, FormProvider, FormViewItem } from 'parsifly-extension-base';

// Envs.DEBUG = true;


new class Extension extends ExtensionBase {
  selection = undefined;

  fieldView = new FormViewItem({
    key: 'view',
    name: 'view',
    type: 'view',
    label: 'View',
    children: false,
    icon: undefined,
    defaultValue: undefined,
    description: 'Description of the field',
  });
  fieldText = new FormViewItem({
    key: 'text',
    name: 'text',
    type: 'text',
    label: 'Text',
    children: false,
    icon: undefined,
    defaultValue: undefined,
    description: 'Description of the field',
    getValue: async () => {
      return 'Testando';
    },
    onDidChange: async (value) => {
      console.log('did change text field', value);
    },
  });
  fieldNumber = new FormViewItem({
    key: 'number',
    name: 'number',
    type: 'number',
    label: 'Number',
    children: false,
    icon: undefined,
    defaultValue: undefined,
    description: 'Description of the field',
  });
  fieldLongText = new FormViewItem({
    key: 'longText',
    name: 'longText',
    type: 'longText',
    label: 'LongText',
    children: false,
    icon: undefined,
    defaultValue: undefined,
    description: 'Description of the field',
  });
  fieldAutocomplete = new FormViewItem({
    key: 'autocomplete',
    name: 'autocomplete',
    type: 'autocomplete',
    label: 'Autocomplete',
    children: false,
    icon: undefined,
    defaultValue: undefined,
    description: 'Description of the field',
  });
  fieldSwitch = new FormViewItem({
    key: 'switch',
    name: 'switch',
    type: 'switch',
    label: 'Switch',
    children: false,
    icon: undefined,
    defaultValue: undefined,
    description: 'Description of the field',
  });
  fieldButton = new FormViewItem({
    key: 'button',
    name: 'button',
    type: 'button',
    label: 'Button',
    children: false,
    icon: undefined,
    defaultValue: undefined,
    description: 'Description of the field',
  });
  fieldObject = new FormViewItem({
    key: 'object',
    name: 'object',
    type: 'object',
    label: 'Object',
    children: false,
    icon: undefined,
    defaultValue: undefined,
    description: 'Description of the field',
  });
  fieldListOf = new FormViewItem({
    key: 'listOf',
    name: 'listOf',
    type: 'listOf',
    label: 'ListOf',
    children: false,
    icon: undefined,
    defaultValue: undefined,
    description: 'Description of the field',
  });

  propertiesView = new View({
    key: 'properties-side-bar',
    dataProvider: new FormProvider({
      key: 'properties-data-provider',
      getFields: async (field) => {
        if (field?.children) return [];

        console.log(await this.application.selection.get());

        return [
          this.fieldView,
          this.fieldText,
          this.fieldNumber,
          this.fieldLongText,
          this.fieldAutocomplete,
          this.fieldSwitch,
          this.fieldButton,
          this.fieldObject,
          this.fieldListOf,
        ];
      },
    }),
  });


  async activate() {
    console.log('EXTENSION: Activating');

    this.application.views.register(this.propertiesView);

    this.application.views.register(this.fieldView);
    this.application.views.register(this.fieldText);
    this.application.views.register(this.fieldNumber);
    this.application.views.register(this.fieldLongText);
    this.application.views.register(this.fieldAutocomplete);
    this.application.views.register(this.fieldSwitch);
    this.application.views.register(this.fieldButton);
    this.application.views.register(this.fieldObject);
    this.application.views.register(this.fieldListOf);

    await this.application.commands.editor.showSecondarySideBarByKey('properties-side-bar');
  }

  async deactivate() {
    console.log('EXTENSION: Deactivating');

    this.application.views.unregister(this.propertiesView);

    this.application.views.unregister(this.fieldView);
    this.application.views.unregister(this.fieldText);
    this.application.views.unregister(this.fieldNumber);
    this.application.views.unregister(this.fieldLongText);
    this.application.views.unregister(this.fieldAutocomplete);
    this.application.views.unregister(this.fieldSwitch);
    this.application.views.unregister(this.fieldButton);
    this.application.views.unregister(this.fieldObject);
    this.application.views.unregister(this.fieldListOf);
  }
};
