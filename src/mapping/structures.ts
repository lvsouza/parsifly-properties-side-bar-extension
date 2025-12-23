import { FieldDescriptor, IDoc, IStructureAttribute, TApplication, TDataType } from 'parsifly-extension-base';
import { TFieldDescriptorType } from 'parsifly-extension-base/dist/types/lib/shared/descriptors/TFieldDescriptor';


export const getStructureAttributeProperties = (_application: TApplication, item: IStructureAttribute, path: IDoc<IStructureAttribute>) => {

  return [
    new FieldDescriptor({
      key: crypto.randomUUID(),
      initialValue: {
        label: 'Name',
        name: 'name',
        type: 'text',
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
      }
    }),
    new FieldDescriptor({
      key: crypto.randomUUID(),
      initialValue: {
        label: 'Description',
        name: 'description',
        type: 'longText',
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
      }
    }),
    new FieldDescriptor({
      key: crypto.randomUUID(),
      initialValue: {
        label: 'Required',
        name: 'required',
        type: 'boolean',
        defaultValue: true,
        description: 'Change attribute is required',
        getValue: async () => {
          if (path) return await path.field('required').value() || true;
          return item.required || true;
        },
        onDidChange: async (value) => {
          if (typeof value === 'string' && path) {
            await path.field('required').set(value);
          }
        },
      }
    }),
    new FieldDescriptor({
      key: crypto.randomUUID(),
      initialValue: {
        label: 'Data type',
        name: 'dataType',
        type: 'text',
        defaultValue: true,
        description: 'Change attribute type',
        getValue: async () => {
          if (path) return await path.field('dataType').value() || true;
          return item.dataType || true;
        },
        onDidChange: async (value) => {
          if (typeof value === 'string' && path) {
            await path.field('dataType').set(value);
          }
        },
      }
    }),
    new FieldDescriptor({
      key: crypto.randomUUID(),
      initialValue: {
        label: 'Default value',
        name: 'defaultValue',
        type: 'boolean',
        description: 'Change attribute is defaultValue',
        getValue: async () => {
          if (path) return await path.field('defaultValue').value() || true;
          return item.defaultValue || true;
        },
        onDidChange: async (value) => {
          if (typeof value === 'string' && path) {
            await path.field('defaultValue').set(value);
          }
        },
      },
      onDidMount: async (context) => {
        const dataType = await path.field('dataType').value();
        const fieldType = getFieldTypeByDataType(dataType);
        if (fieldType) {
          await path.field('defaultValue').set('');
          await context.set('type', fieldType);
          await context.set('disabled', false);
        } else {
          await context.set('disabled', true);
          await context.set('type', 'text');
        }

        const subscription = await path.field('dataType').onValue(async value => {
          const fieldType = getFieldTypeByDataType(value);
          if (fieldType) {
            await path.field('defaultValue').set('');
            await context.set('type', fieldType);
            await context.set('disabled', false);
          } else {
            await context.set('disabled', true);
            await context.set('type', 'text');
          }
        });

        context.onDidUnmount(async () => {
          subscription.unsubscribe();
        });
      },
    }),
  ];
}

const getFieldTypeByDataType = (dataType: TDataType): TFieldDescriptorType | null => {
  switch (dataType) {
    case 'string': return 'text'
    case 'number': return 'number'
    case 'boolean': return 'boolean'
    default: return null;
  }
}
