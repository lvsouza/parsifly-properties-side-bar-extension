import { ExtensionBase, View, FormProvider, FieldsDescriptor, FieldDescriptor } from 'parsifly-extension-base';


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


  defaultFieldsDescriptor = new FieldsDescriptor({
    key: 'default-fields',
    onGetFields: async (key) => {
      const [item, path] = await this.application.dataProviders.findAnyResourceByKey(key);


      switch (item?.type) {
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
                await path.field('public').set<boolean>(value);
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
        case 'action': return [
          new FieldDescriptor({
            key: crypto.randomUUID(),
            label: 'Name',
            name: 'name',
            type: 'text',
            children: false,
            defaultValue: '',
            description: 'Change action name',
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
            description: 'Change action description',
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
        case 'structure': return [
          new FieldDescriptor({
            key: crypto.randomUUID(),
            label: 'Name',
            name: 'name',
            type: 'text',
            children: false,
            defaultValue: '',
            description: 'Change structure name',
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
            description: 'Change structure description',
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
        case 'structure_attribute': return [
          new FieldDescriptor({
            key: crypto.randomUUID(),
            label: 'Name',
            name: 'name',
            type: 'text',
            children: false,
            defaultValue: '',
            description: 'Change attribute name',
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
            description: 'Change attribute description',
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
