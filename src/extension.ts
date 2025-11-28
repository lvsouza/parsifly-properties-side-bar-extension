import { ExtensionBase, View, FormProvider, FieldsDescriptor, FieldDescriptor, IPage, IComponent, IService } from 'parsifly-extension-base';


new class Extension extends ExtensionBase {

  // View principal: Properties
  private propertiesView = new View({
    key: 'properties-side-bar',
    dataProvider: new FormProvider({
      key: 'properties-data-provider',
      getFields: async () => {
        const selectedKeys = await this.application.selection.get();
        if (!selectedKeys.length) return [];

        const selectedKey = selectedKeys[0];

        return await this.application.fields.get(selectedKey);
      },
    }),
  });

  private selectionUnsubscribe = this.application.selection.subscribe(async () => {
    await this.application.views.refresh(this.propertiesView);
  });



  defaultFieldsDescriptor = new FieldsDescriptor({
    key: 'default-fields',
    onGetFields: async (key) => {
      const page = await this.application.dataProviders.project().collection<IPage>('pages').doc(key).value();
      if (page) return [
        new FieldDescriptor({
          key: crypto.randomUUID(),
          label: 'Name',
          name: 'name',
          type: 'text',
          children: false,
          icon: '',
          defaultValue: '',
          description: 'Change page name',
          getValue: async () => {
            return page.name;
          },
          onDidChange: async (value) => {
            if (typeof value === 'string') {
              await this.application.dataProviders.project().collection<IPage>('pages').doc(key).field('name').set(value);
            }
          },
        }),
        new FieldDescriptor({
          key: crypto.randomUUID(),
          label: 'Description',
          name: 'description',
          type: 'longText',
          children: false,
          icon: '',
          defaultValue: '',
          description: 'Change page description',
          getValue: async () => {
            return page.description || '';
          },
          onDidChange: async (value) => {
            if (typeof value === 'string') {
              await this.application.dataProviders.project().collection<IPage>('pages').doc(key).field('description').set(value);
            }
          },
        }),
      ];

      const component = await this.application.dataProviders.project().collection<IComponent>('components').doc(key).value();
      if (component) return [
        new FieldDescriptor({
          key: crypto.randomUUID(),
          label: 'Name',
          name: 'name',
          type: 'text',
          children: false,
          icon: '',
          defaultValue: '',
          description: 'Change component name',
          getValue: async () => {
            return component.name;
          },
          onDidChange: async (value) => {
            if (typeof value === 'string') {
              await this.application.dataProviders.project().collection<IComponent>('components').doc(key).field('name').set(value);
            }
          },
        }),
        new FieldDescriptor({
          key: crypto.randomUUID(),
          label: 'Description',
          name: 'description',
          type: 'longText',
          children: false,
          icon: '',
          defaultValue: '',
          description: 'Change component description',
          getValue: async () => {
            return component.description || '';
          },
          onDidChange: async (value) => {
            if (typeof value === 'string') {
              await this.application.dataProviders.project().collection<IComponent>('components').doc(key).field('description').set(value);
            }
          },
        }),
      ];

      const service = await this.application.dataProviders.project().collection<IService>('services').doc(key).value();
      if (service) return [
        new FieldDescriptor({
          key: crypto.randomUUID(),
          label: 'Name',
          name: 'name',
          type: 'text',
          children: false,
          icon: '',
          defaultValue: '',
          description: 'Change service name',
          getValue: async () => {
            return service.name;
          },
          onDidChange: async (value) => {
            if (typeof value === 'string') {
              await this.application.dataProviders.project().collection<IService>('services').doc(key).field('name').set(value);
            }
          },
        }),
        new FieldDescriptor({
          key: crypto.randomUUID(),
          label: 'Description',
          name: 'description',
          type: 'longText',
          children: false,
          icon: '',
          defaultValue: '',
          description: 'Change service description',
          getValue: async () => {
            return service.description || '';
          },
          onDidChange: async (value) => {
            if (typeof value === 'string') {
              await this.application.dataProviders.project().collection<IService>('services').doc(key).field('description').set(value);
            }
          },
        }),
      ];

      return [];
    }
  })




  async activate() {
    this.application.views.register(this.propertiesView);
    this.application.fields.register(this.defaultFieldsDescriptor);

    await this.application.commands.editor.showSecondarySideBarByKey('properties-side-bar');
  }

  async deactivate() {
    this.application.views.unregister(this.propertiesView);
    this.application.fields.unregister(this.defaultFieldsDescriptor);

    this.selectionUnsubscribe();
  }
};
