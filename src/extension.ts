import { ExtensionBase, View, FormProvider, FormViewItem } from 'parsifly-extension-base';

new class Extension extends ExtensionBase {
  // Campos dinâmicos criados e registrados
  private dynamicFields: FormViewItem[] = [];

  // Schema dos tipos de recurso
  // Cada tipo define os campos que deseja exibir
  private resourceSchemas: Record<string, Array<{
    key: string;
    type: string;
    label?: string;
    description?: string;
    defaultValue?: any;
  }>> = {
      page: [
        { key: 'id', type: 'view' },
        { key: 'name', type: 'text' },
        { key: 'description', type: 'longText' },
        { key: 'status', type: 'switch', defaultValue: true },
      ],
      component: [
        { key: 'id', type: 'view' },
        { key: 'name', type: 'text' },
        { key: 'props', type: 'object' },
        { key: 'enabled', type: 'switch', defaultValue: false },
      ],
      service: [
        { key: 'id', type: 'view' },
        { key: 'name', type: 'text' },
        { key: 'description', type: 'longText' },
        { key: 'timeout', type: 'number', defaultValue: 1000 },
        { key: 'active', type: 'switch', defaultValue: true },
      ],
    };

  // Geração de fields com registro automático
  private createDynamicField = (config: {
    key: string;
    type: string;
    label?: string;
    description?: string;
    defaultValue?: any;
  }): FormViewItem => {
    const field = new FormViewItem({
      key: `dyn-${config.key}`,
      name: config.key,
      type: config.type,
      label: config.label ?? config.key,
      description: config.description ?? '',
      children: false,
      defaultValue: config.defaultValue,

      getValue: async () => config.defaultValue,
      onDidChange: async (value) => {
        console.log(`Dynamic field changed [${config.key}]`, value);
      },
    });

    this.application.views.register(field);
    this.dynamicFields.push(field);

    return field;
  };

  // Limpa todos os fields dinâmicos registrados
  private clearDynamicFields = () => {
    for (const field of this.dynamicFields) {
      try {
        this.application.views.unregister(field);
      } catch (e) {
        console.warn('Erro ao unregister field:', field.name, e);
      }
    }
    this.dynamicFields = [];
  };

  // View principal: Properties
  private propertiesView = new View({
    key: 'properties-side-bar',
    dataProvider: new FormProvider({
      key: 'properties-data-provider',
      getFields: async () => {
        this.clearDynamicFields();

        const selectedKeys = await this.application.selection.get();
        if (!selectedKeys.length) return [];

        const selectedKey = selectedKeys[0];

        // Descobrir o tipo real do recurso perguntando ao DataProvider
        // pages
        const pages = await this.application.dataProviders.project.pages();
        const page = pages.find((p) => p.id === selectedKey);
        if (page) return this.generateFieldsForType('page', page);

        // components
        const components = await this.application.dataProviders.project.components();
        const component = components.find((c) => c.id === selectedKey);
        if (component) return this.generateFieldsForType('component', component);

        // services
        const services = await this.application.dataProviders.project.services();
        const service = services.find((s) => s.id === selectedKey);
        if (service) return this.generateFieldsForType('service', service);

        // pasta (não está nas listas acima, então tratamos como folder)
        return this.generateFieldsForType('folder', { id: selectedKey });
      },
    }),
  });

  // Gera fields com base no schema do tipo
  private generateFieldsForType = (type: string, resource: any): FormViewItem[] => {
    const schema = this.resourceSchemas[type];
    if (!schema) return [];

    return schema.map((fieldSchema) => {
      const defaultValue = resource[fieldSchema.key] ?? fieldSchema.defaultValue;

      return this.createDynamicField({
        key: fieldSchema.key,
        type: fieldSchema.type,
        label: fieldSchema.label ?? fieldSchema.key,
        description: fieldSchema.description,
        defaultValue,
      });
    });
  };

  private selectionUnsubscribe = this.application.selection.subscribe(async () => {
    this.clearDynamicFields();
    await this.application.views.refresh(this.propertiesView);
  });

  async activate() {
    this.application.views.register(this.propertiesView);
    await this.application.commands.editor.showSecondarySideBarByKey('properties-side-bar');
  }

  async deactivate() {
    this.application.views.unregister(this.propertiesView);
    this.clearDynamicFields();
    this.selectionUnsubscribe();
  }
};
