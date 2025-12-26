import { CompletionViewItem, FieldDescriptor, IDoc, IStructureAttribute, TApplication, TDataType, TFieldDescriptorType } from 'parsifly-extension-base';


export const getStructureAttributeProperties = (application: TApplication, item: IStructureAttribute, path: IDoc<IStructureAttribute>) => {

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
        type: 'textarea',
        defaultValue: '',
        name: 'description',
        label: 'Description',
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
        defaultValue: true,
        type: 'autocomplete',
        description: 'Change attribute type',
        getValue: async (context) => {
          if (!path) return null;

          const dataTypeValue = await path.field('dataType').value();
          const completions = await context.getCompletions()

          switch (dataTypeValue) {
            case 'null':
            case 'string':
            case 'number':
            case 'boolean':
            case 'binary': {
              const completion = completions.find(completion => completion.value === dataTypeValue);
              return completion || null;
            }
            case 'object': {
              const attributes = await path.collection('attributes').value();
              return new CompletionViewItem({
                key: 'object',
                initialValue: {
                  value: 'object',
                  icon: { type: 'object' },
                  label: `Object of<${attributes.map(attribute => attribute.dataType).join(',')}>`,
                },
              }).serialize();
            }
            case 'array_object': {
              const attributes = await path.collection('attributes').value();
              return new CompletionViewItem({
                key: 'object',
                initialValue: {
                  value: 'array_object',
                  icon: { type: 'array' },
                  label: `Array of<${attributes.map(attribute => attribute.dataType).join(',')}>`,
                },
              }).serialize();
            }
            case 'structure': {
              const completion = completions.find(completion => completion.value === dataTypeValue);
              return completion || null;
            }
            case 'array_structure': {
              const completion = completions.find(completion => completion.value === dataTypeValue);
              return completion || null;
            }

            default: return dataTypeValue;
          }
        },
        onDidChange: async (value, context) => {
          console.log(value)
          await path.field('dataType').set(value);
          await context.reloadValue();
        },
        getCompletions: async (query, context) => {
          console.log('getCompletions', query, context);

          const result = await application.completions.get({
            kind: 'type',
            visibility: {
              type: 'structure_attribute',
            }
          });

          return result;
        },
      },
    }),
    new FieldDescriptor({
      key: crypto.randomUUID(),
      initialValue: {
        label: 'Default value',
        name: 'defaultValue',
        type: 'boolean',
        description: 'Change attribute is defaultValue',
        getValue: async () => {
          if (path) return await path.field('defaultValue').value() ?? true;
          return item.defaultValue ?? true;
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
          await context.set('type', fieldType);
          await context.set('disabled', false);
        } else {
          await path.field('defaultValue').set('');
          await context.set('disabled', true);
          await context.set('type', 'text');
        }

        const subscription = await path.field('dataType').onValue(async value => {
          const fieldType = getFieldTypeByDataType(value);
          if (fieldType) {
            await context.set('type', fieldType);
            await context.set('disabled', false);
          } else {
            await path.field('defaultValue').set('');
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
