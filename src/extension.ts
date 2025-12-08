import { ExtensionBase, View, FormProvider, FieldsDescriptor, FieldDescriptor, IPage, IComponent, IService, IFolder, IDoc, ICollection, IProject, TProjectType } from 'parsifly-extension-base';


new class Extension extends ExtensionBase {

  // View principal: Properties
  propertiesView = new View({
    key: 'properties-side-bar',
    initialValue: {
      title: 'Properties',
      position: 'secondary',
      description: 'Description da view',
      icon: { name: 'VscSymbolProperty' },
      dataProvider: new FormProvider({
        key: 'properties-data-provider',
        getFields: async () => {
          const selectedKeys = await this.application.selection.get();
          if (!selectedKeys.length) return [];

          const selectedKey = selectedKeys[0];

          return await this.application.fields.get(selectedKey);
        },
      }),
    },
    onDidMount: async (context) => {
      const selectionUnsubscribe = this.application.selection.subscribe(async () => context.refetchData());


      context.onDidUnmount(async () => {
        selectionUnsubscribe();
      });
    },
  });


  deepSearch(base: ICollection<IPage | IComponent | IService | IFolder>, key: string, items: (IPage | IComponent | IService | IFolder)[]): [IProject<TProjectType> | IPage | IComponent | IService | IFolder | undefined, IDoc<IPage | IComponent | IService | IFolder> | undefined] {
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
      const itemProject: any = await this.application.dataProviders.project().value();
      const pathProject: IDoc<any> = this.application.dataProviders.project();

      let item: any = itemProject;
      let path: IDoc<any> = pathProject;

      if (item.id !== key) {
        [item, path = pathProject] = this.deepSearch(pathProject.collection('pages'), key, itemProject.pages);
      }
      if (!item) {
        [item, path = pathProject] = this.deepSearch(pathProject.collection('components'), key, itemProject.components);
      }
      if (!item) {
        [item, path = pathProject] = this.deepSearch(pathProject.collection('services'), key, itemProject.services);
      }

      switch (item?.type) {
        case 'package':
        case 'application': return [
          new FieldDescriptor({
            name: 'name',
            type: 'text',
            label: 'Name',
            key: crypto.randomUUID(),
            description: 'Change project name',
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
            type: 'longText',
            name: 'description',
            label: 'Description',
            key: crypto.randomUUID(),
            description: 'Change project description',
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
          new FieldDescriptor({
            type: 'text',
            name: 'version',
            label: 'Version',
            key: crypto.randomUUID(),
            description: 'Change project version',
            getValue: async () => {
              if (path) return await path.field('version').value() || '';
              return item.version || '';
            },
            onDidChange: async (value) => {
              if (typeof value === 'string' && path) {
                await path.field('version').set(value);
              }
            },
          }),
          new FieldDescriptor({
            name: 'public',
            type: 'boolean',
            label: 'Public',
            key: crypto.randomUUID(),
            description: 'Change project visibility',
            getValue: async () => {
              if (path) return await path.field('public').value() || false;
              return item.public || false;
            },
            onDidChange: async (value) => {
              if (typeof value === 'boolean' && path) {
                await path.field('public').set(value);
              }
            },
          }),
        ];
        case 'page': return [
          new FieldDescriptor({
            key: crypto.randomUUID(),
            label: 'Name',
            name: 'name',
            type: 'text',
            children: false,
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
  }
};
