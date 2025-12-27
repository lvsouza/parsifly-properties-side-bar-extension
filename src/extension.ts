import { ExtensionBase, View, FormProvider, FieldsDescriptor, FieldViewItem, IDoc, IStructureAttribute, CompletionsDescriptor, CompletionViewItem, IStructure, IFolder } from 'parsifly-extension-base';
import { getStructureAttributeProperties } from './mapping/structures';


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
      if (!path) return [];

      switch (item?.type) {
        case 'application': return [
          new FieldViewItem({
            key: crypto.randomUUID(),
            initialValue: {
              name: 'name',
              type: 'text',
              label: 'Name',
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
            },
          }),
          new FieldViewItem({
            key: crypto.randomUUID(),
            initialValue: {
              type: 'textarea',
              name: 'description',
              label: 'Description',
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
            }
          }),
          new FieldViewItem({
            key: crypto.randomUUID(),
            initialValue: {
              type: 'text',
              name: 'version',
              label: 'Version',
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
            }
          }),
          new FieldViewItem({
            key: crypto.randomUUID(),
            initialValue: {
              name: 'public',
              type: 'boolean',
              label: 'Public',
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
            },
          }),
        ];
        case 'page': return [
          new FieldViewItem({
            key: crypto.randomUUID(),
            initialValue: {
              label: 'Name',
              name: 'name',
              type: 'text',
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
            }
          }),
          new FieldViewItem({
            key: crypto.randomUUID(),
            initialValue: {
              label: 'Description',
              name: 'description',
              type: 'textarea',
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
            },
          }),
        ];
        case 'component': return [
          new FieldViewItem({
            key: crypto.randomUUID(),
            initialValue: {
              label: 'Name',
              name: 'name',
              type: 'text',
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
            }
          }),
          new FieldViewItem({
            key: crypto.randomUUID(),
            initialValue: {
              label: 'Description',
              name: 'description',
              type: 'textarea',
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
            },
          }),
        ];
        case 'action': return [
          new FieldViewItem({
            key: crypto.randomUUID(),
            initialValue: {
              label: 'Name',
              name: 'name',
              type: 'text',
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
            }
          }),
          new FieldViewItem({
            key: crypto.randomUUID(),
            initialValue: {
              label: 'Description',
              name: 'description',
              type: 'textarea',
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
            },
          }),
        ];
        case 'folder': return [
          new FieldViewItem({
            key: crypto.randomUUID(),
            initialValue: {
              label: 'Name',
              name: 'name',
              type: 'text',
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
            }
          }),
          new FieldViewItem({
            key: crypto.randomUUID(),
            initialValue: {
              label: 'Description',
              name: 'description',
              type: 'textarea',
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
            },
          }),
        ];
        case 'structure': return [
          new FieldViewItem({
            key: crypto.randomUUID(),
            initialValue: {
              label: 'Name',
              name: 'name',
              type: 'text',
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
            }
          }),
          new FieldViewItem({
            key: crypto.randomUUID(),
            initialValue: {
              label: 'Description',
              name: 'description',
              type: 'textarea',
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
            },
          }),
        ];
        case 'structure_attribute': return getStructureAttributeProperties(this.application, item, path as IDoc<IStructureAttribute>)

        default: return []
      }
    }
  })

  primitiveTypes = [
    new CompletionViewItem({
      key: 'string',
      initialValue: {
        label: 'String',
        value: 'string',
        icon: { type: 'string' },
        description: 'Base type for strings',
      },
    }),
    new CompletionViewItem({
      key: 'number',
      initialValue: {
        label: 'Number',
        value: 'number',
        icon: { type: 'number' },
        description: 'Base type for numbers',
      },
    }),
    new CompletionViewItem({
      key: 'boolean',
      initialValue: {
        label: 'Boolean',
        value: 'boolean',
        icon: { type: 'boolean' },
        description: 'Base type for booleans',
      },
    }),
    new CompletionViewItem({
      key: 'binary',
      initialValue: {
        label: 'Binary',
        value: 'binary',
        icon: { type: 'binary' },
        description: 'Base type for binary',
      },
    }),
  ];
  primitiveComposableTypes = [
    new CompletionViewItem({
      key: 'object',
      initialValue: {
        label: 'Object',
        value: 'object',
        icon: { type: 'object' },
        description: 'Allow to add more attributes',
      },
    }),
    new CompletionViewItem({
      key: 'array',
      initialValue: {
        label: 'Array',
        value: 'array',
        icon: { type: 'array' },
        description: 'List of some primitive or composed type',
      },
    }),
  ];
  flatFolders(structures: (IStructure | IFolder<IStructure>)[]): IStructure[] {
    return structures.flatMap(structure => structure.type === 'structure' ? [structure] : this.flatFolders(structure.content))
  }
  basicCompletions = new CompletionsDescriptor({
    key: 'basic',
    onGetCompletions: async (intent) => {
      console.log('intent', intent)

      const structuresAndFolders = await this.application.dataProviders.project().collection<IStructure | IFolder<IStructure>>('structures').value()
      const structures = this.flatFolders(structuresAndFolders);

      if (intent.kind === 'type') return [
        ...this.primitiveTypes,
        ...this.primitiveComposableTypes,
        ...structures.map(structure => (
          new CompletionViewItem({
            key: structure.id,
            initialValue: {
              label: structure.name,
              icon: { type: 'structure' },
              description: structure.description || '',
              value: { type: 'structure', referenceId: structure.id },
            },
          })
        )),
      ];

      if (intent.kind === 'type_of_array') return [
        ...this.primitiveTypes,
        new CompletionViewItem({
          key: 'object',
          initialValue: {
            label: 'Object',
            value: 'object',
            icon: { type: 'object' },
            description: 'Allow to add more attributes',
          },
        }),
        ...structures.map(structure => (
          new CompletionViewItem({
            key: structure.id,
            initialValue: {
              label: structure.name,
              icon: { type: 'structure' },
              description: structure.description || '',
              value: { type: 'structure', referenceId: structure.id },
            },
          })
        )),
      ];

      return [];
    }
  })


  async activate() {
    this.application.views.register(this.propertiesView);
    this.application.fields.register(this.defaultFieldsDescriptor);
    this.application.completions.register(this.basicCompletions);

    await this.application.views.showSecondarySideBarByKey('properties-side-bar');
  }

  async deactivate() {
    this.application.views.unregister(this.propertiesView);
    this.application.fields.unregister(this.defaultFieldsDescriptor);
    this.application.completions.unregister(this.basicCompletions);
  }
};
