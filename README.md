# SMC Instruction

## Example 1

1. **Initiate Segment in Component1**

```const defaultForSegment1 = {
    name: "Segment1",
    defaultValue: {
      val1: "test1",
      val2: "test2",
      val3: { nestedVal: "nested value", test: "cool1", secondNested: { val4: "test4" } },
    },
  };

  const segment = useSegment(defaultForSegment1);
```

2. **Connect to Segment1 in Component2**

   `const segment = useSegment({ name: "Segment1"});`

3. **useSegment methods (details are WIP)**:

   - `update`
   - `watch`
   - `get`
   - `segmentValue`
   - `delete`
