import { CompletionViewItem, FieldViewItem, IDoc, IStructureAttribute, TApplication, TDataType, TFieldViewItemType, TFieldViewItemValue } from 'parsifly-extension-base';


export const getStructureAttributeProperties = (application: TApplication, item: IStructureAttribute, path: IDoc<IStructureAttribute>) => {

  return [
    new FieldViewItem({
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
    new FieldViewItem({
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
    new FieldViewItem({
      key: crypto.randomUUID(),
      initialValue: {
        label: 'Required',
        name: 'required',
        type: 'boolean',
        defaultValue: true,
        description: 'Change attribute is required',
        getValue: async () => {
          if (path) return await path.field('required').value();
          return item.required;
        },
        onDidChange: async (value) => {
          if (typeof value === 'boolean' && path) {
            await path.field('required').set(value);
          }
        },
      }
    }),
    new FieldViewItem({
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
                  label: `Object of ${attributes.map(attribute => attribute.dataType).join(',')}`,
                },
              }).serialize();
            }
            case 'structure': {
              const referenceId = await path.field('referenceId').value();
              const completion = completions.find((completion: any) => typeof completion.value === 'object' && 'type' in completion.value && completion.value.type === 'structure' && completion.value.referenceId === referenceId);
              return completion || null;
            }
            case 'array_object': {
              const attributes = await path.collection('attributes').value();
              return new CompletionViewItem({
                key: 'object',
                initialValue: {
                  value: 'array_object',
                  icon: { type: 'array' },
                  label: `Array of ${attributes.map(attribute => attribute.dataType.replace('array_', '')).join(',')}`,
                },
              }).serialize();
            }
            case 'array_structure': {
              const referenceId = await path.field('referenceId').value();
              const completion = completions.find((completion: any) => typeof completion.value === 'object' && 'type' in completion.value && completion.value.type === 'structure' && completion.value.referenceId === referenceId);
              if (!completion) return null;

              return new CompletionViewItem({
                key: 'array_structure',
                initialValue: {
                  icon: { type: 'array' },
                  label: `Array of ${completion.label}`,
                  value: { type: 'array_structure', referenceId },
                },
              }).serialize();
            }

            default: {
              return new CompletionViewItem({
                key: dataTypeValue,
                initialValue: {
                  value: dataTypeValue,
                  icon: { type: 'array' },
                  label: `Array of ${dataTypeValue.replace('array_', '')}`,
                },
              }).serialize();
            }
          }
        },
        onDidChange: async (value, context) => {
          if (value && typeof value === 'object' && 'type' in value && value.type === 'structure') {
            await path.field('referenceId').set(value.referenceId);
            await path.field('dataType').set(value.type);
            await path.collection('attributes').set([]);
            await path.field('defaultValue').set(null);
          } else if (value === 'object') {
            const previousAttributeData = await path.value();

            await path.collection<IStructureAttribute>('attributes').set([{ ...previousAttributeData, id: crypto.randomUUID() }]);
            await path.field('defaultValue').set(null);
            await path.field('referenceId').set(null);
            await path.field('dataType').set(value);
          } else if (value === 'array') {
            const arrayTypesCompletions = await application.completions.get({
              kind: 'type_of_array',
              visibility: {
                type: 'structure_attribute',
              },
            })

            const arrayType = await application.quickPick.show<TFieldViewItemValue>({
              modal: true,
              selectOnly: true,
              title: 'Select the array type',
              options: arrayTypesCompletions,
              helpText: 'Select one of this options',
            });
            if (!arrayType) return;

            if (arrayType && typeof arrayType === 'object' && 'type' in arrayType && arrayType.type === 'structure') {
              await path.field('referenceId').set(arrayType.referenceId);
              await path.field('dataType').set(`array_structure`);
              await path.collection('attributes').set([]);
            } else if (arrayType === 'object') {
              const previousAttributeData = await path.value();

              await path.collection<IStructureAttribute>('attributes').set([{ ...previousAttributeData, id: crypto.randomUUID() }]);
              await path.field('dataType').set(`array_object`);
              await path.field('defaultValue').set(null);
              await path.field('referenceId').set(null);
            } else {
              await path.field('dataType').set(`array_${arrayType}`);
              await path.collection('attributes').set([]);
              await path.field('referenceId').set(null);
            }

            await path.field('defaultValue').set(null);
          } else {
            await path.collection('attributes').set([]);
            await path.field('referenceId').set(null);
            await path.field('dataType').set(value);

            const defaultValue = await path.field('defaultValue').value();
            if (typeof defaultValue !== value) {
              await path.field('defaultValue').set(null);
            }
          }

          await context.reloadValue();
        },
        getCompletions: async () => {
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
    new FieldViewItem({
      key: crypto.randomUUID(),
      initialValue: {
        label: 'Default value',
        name: 'defaultValue',
        type: 'boolean',
        description: 'Change attribute is defaultValue',
        getValue: async () => {
          if (path) return await path.field('defaultValue').value() ?? null;
          return item.defaultValue ?? null;
        },
        onDidChange: async (value) => {
          if (path) {
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

const getFieldTypeByDataType = (dataType: TDataType): TFieldViewItemType | null => {
  switch (dataType) {
    case 'string': return 'text'
    case 'number': return 'number'
    case 'boolean': return 'boolean'
    default: return null;
  }
}
