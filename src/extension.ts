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



  dynamicFields: Set<FieldDescriptor> = new Set();
  createRegisteredField(props: FieldDescriptor) {
    const field = new FieldDescriptor(props);

    this.dynamicFields.add(field);
    this.application.fields.register(field);

    return field;
  }
  clearFields() {
    this.dynamicFields.forEach(field => {
      this.application.fields.unregister(field);
      this.dynamicFields.delete(field);
    })
  }

  defaultFieldsDescriptor = new FieldsDescriptor({
    key: 'default-fields',
    onGetFields: async (key) => {
      this.clearFields();

      console.log('fields get', key);

      const page = await this.application.dataProviders.doc('project').collection<IPage>('pages').doc(key).value();
      if (page) return [
        this.createRegisteredField({
          key: crypto.randomUUID(),
          label: 'Name',
          name: 'name',
          type: 'text',
          children: false,
          icon: '',
          defaultValue: '',
          description: 'Altera o nome do campo',
          getValue: async () => {
            return page.name;
          },
          onDidChange: async (value) => {
            if (typeof value === 'string') {
              await this.application.dataProviders.doc('project').collection<IPage>('pages').doc(key).field('name').set(value);
            }
          },
        }),
      ];

      const component = await this.application.dataProviders.doc('project').collection<IComponent>('components').doc(key).value();
      if (component) return [
        this.createRegisteredField({
          key: crypto.randomUUID(),
          label: 'Name',
          name: 'name',
          type: 'text',
          children: false,
          icon: '',
          defaultValue: '',
          description: 'Altera o nome do campo',
          getValue: async () => {
            return component.name;
          },
          onDidChange: async (value) => {
            if (typeof value === 'string') {
              await this.application.dataProviders.doc('project').collection<IComponent>('components').doc(key).field('name').set(value);
            }
          },
        }),
      ];

      const service = await this.application.dataProviders.doc('project').collection<IService>('services').doc(key).value();
      if (service) return [
        this.createRegisteredField({
          key: crypto.randomUUID(),
          label: 'Name',
          name: 'name',
          type: 'text',
          children: false,
          icon: '',
          defaultValue: '',
          description: 'Altera o nome do campo',
          getValue: async () => {
            return service.name;
          },
          onDidChange: async (value) => {
            if (typeof value === 'string') {
              await this.application.dataProviders.doc('project').collection<IService>('services').doc(key).field('name').set(value);
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
