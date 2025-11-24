import { ExtensionBase, View, FormProvider, FieldsDescriptor, FieldDescriptor } from 'parsifly-extension-base';

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

        // Descobrir o tipo real do recurso perguntando ao DataProvider
        // pages
        const pages = await this.application.dataProviders.project.pages();
        const page = pages.find((p) => p.id === selectedKey);
        if (page) {
          const fields = await this.application.fields.get(page.id);

          console.log('fields', fields)

          return fields;
        }

        // components
        const components = await this.application.dataProviders.project.components();
        const component = components.find((c) => c.id === selectedKey);
        if (component) return await this.application.fields.get(component.id);

        // services
        const services = await this.application.dataProviders.project.services();
        const service = services.find((s) => s.id === selectedKey);
        if (service) return await this.application.fields.get(service.id);

        // pasta (não está nas listas acima, então tratamos como folder)
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

      const pages = await this.application.dataProviders.project.pages();
      const page = pages.find((page) => page.id === key);
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
              page.name = value;
              //await this.application.dataProviders.project.pages.set(page)
            }
          },
        }),
      ];

      const components = await this.application.dataProviders.project.components();
      const component = components.find((component) => component.id === key);
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
              component.name = value;
              //await this.application.dataProviders.project.components.set(component)
            }
          },
        }),
      ];

      const services = await this.application.dataProviders.project.services();
      const service = services.find((service) => service.id === key);
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
              service.name = value;
              //await this.application.dataProviders.project.services.set(service)
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
