import { ExtensionBase, View, FormProvider, FieldsDescriptor, FieldDescriptor, IDoc, IStructureAttribute } from 'parsifly-extension-base';
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
          new FieldDescriptor({
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
          new FieldDescriptor({
            key: crypto.randomUUID(),
            initialValue: {
              type: 'longText',
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
          new FieldDescriptor({
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
          new FieldDescriptor({
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
          new FieldDescriptor({
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
          new FieldDescriptor({
            key: crypto.randomUUID(),
            initialValue: {
              label: 'Description',
              name: 'description',
              type: 'longText',
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
          new FieldDescriptor({
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
          new FieldDescriptor({
            key: crypto.randomUUID(),
            initialValue: {
              label: 'Description',
              name: 'description',
              type: 'longText',
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
          new FieldDescriptor({
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
          new FieldDescriptor({
            key: crypto.randomUUID(),
            initialValue: {
              label: 'Description',
              name: 'description',
              type: 'longText',
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
          new FieldDescriptor({
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
          new FieldDescriptor({
            key: crypto.randomUUID(),
            initialValue: {
              label: 'Description',
              name: 'description',
              type: 'longText',
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
          new FieldDescriptor({
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
          new FieldDescriptor({
            key: crypto.randomUUID(),
            initialValue: {
              label: 'Description',
              name: 'description',
              type: 'longText',
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
