# SMC

## Why SMC?

No more worries about seting up redux or any other complicated, heavy package.
With SMC you only need `useSegment` hook or `new Segment()` and that's it!

## Example with useSegment

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

## Example with new Segment()

1. **Initiate Segment in .ts file**

```//init schema fro the segment

  type Segment1 = {
    test1: string;
    test2: string;
  };

  //Init Segment
  const testSegment = new Segment<Segment1>("test segment", { test1: "test1", test2: "test2" });

  //init setter
  //init generric getter
  function segment1Setter(key: Paths<Segment1>, value: Segment1[keyof Segment1]) {
    testSegment.update({ [key]: value });
  }

  //init generric getter
  function segment1Getter(key: Paths<Segment1>): Segment1[keyof Segment1] {
    return testSegment.get(key);
  }

  //init watcher
  const watcher = testSegment.watch;

  export { segment1Setter, segment1Getter, watcher };
```

## Coming soons

1. **Ability to safe all state or partail to the session/local storage**
