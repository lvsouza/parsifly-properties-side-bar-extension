import { ExtensionBase, View, FormProvider, FieldsDescriptor, FieldDescriptor, IPage, IComponent, IService, IFolder, IDoc, ICollection } from 'parsifly-extension-base';


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


  deepSearch(base: ICollection<IPage | IComponent | IService | IFolder>, key: string, items: (IPage | IComponent | IService | IFolder)[]): [IPage | IComponent | IService | IFolder | undefined, IDoc<IPage | IComponent | IService | IFolder> | undefined] {
    for (const item of items) {
      if (item.id === key) return [item, base.doc(item.id)];

      if (item.type === 'folder') {
        const [result, resultPath] = this.deepSearch(base.doc(item.id).collection('content'), key, item.content)
        if (result) return [result, resultPath];
      }
    }

    return [undefined, undefined];
  }

  defaultFieldsDescriptor = new FieldsDescriptor({
    key: 'default-fields',
    onGetFields: async (key) => {
      const pages = await this.application.dataProviders.project().collection<IPage>('pages').value();
      let [item, path] = this.deepSearch(this.application.dataProviders.project().collection<IPage>('pages'), key, pages);
      if (!item) {
        const components = await this.application.dataProviders.project().collection<IComponent>('components').value();
        [item, path] = this.deepSearch(this.application.dataProviders.project().collection<IPage>('components'), key, components);
      } else if (!item) {
        const services = await this.application.dataProviders.project().collection<IService>('services').value();
        [item, path] = this.deepSearch(this.application.dataProviders.project().collection<IPage>('services'), key, services);
      }

      switch (item?.type) {
        case 'page': return [
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
              if (path) return await path.field('name').value();
              return item.name;
            },
            onDidChange: async (value) => {
              if (typeof value === 'string' && path) {
                await path.field('name').set(value);
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
              if (path) return await path.field('description').value() || '';
              return item.description || '';
            },
            onDidChange: async (value) => {
              if (typeof value === 'string' && path) {
                await path.field('description').set(value);
              }
            },
          }),
        ];
        case 'component': return [
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
              if (path) return await path.field('name').value();
              return item.name;
            },
            onDidChange: async (value) => {
              if (typeof value === 'string' && path) {
                await path.field('name').set(value);
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
              if (path) return await path.field('description').value() || '';
              return item.description || '';
            },
            onDidChange: async (value) => {
              if (typeof value === 'string' && path) {
                await path.field('description').set(value);
              }
            },
          }),
        ];
        case 'service': return [
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
              if (path) return await path.field('name').value();
              return item.name;
            },
            onDidChange: async (value) => {
              if (typeof value === 'string' && path) {
                await path.field('name').set(value);
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
              if (path) return await path.field('description').value() || '';
              return item.description || '';
            },
            onDidChange: async (value) => {
              if (typeof value === 'string' && path) {
                await path.field('description').set(value);
              }
            },
          }),
        ];
        case 'folder': return [
          new FieldDescriptor({
            key: crypto.randomUUID(),
            label: 'Name',
            name: 'name',
            type: 'text',
            children: false,
            icon: '',
            defaultValue: '',
            description: 'Change folder name',
            getValue: async () => {
              if (path) return await path.field('name').value();
              return item.name;
            },
            onDidChange: async (value) => {
              if (typeof value === 'string' && path) {
                await path.field('name').set(value);
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
              if (path) return await path.field('description').value() || '';
              return item.description || '';
            },
            onDidChange: async (value) => {
              if (typeof value === 'string' && path) {
                await path.field('description').set(value);
              }
            },
          }),
        ];

        default: return []
      }

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
