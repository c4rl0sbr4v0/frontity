import initialState from "../initial-state";

const settings = {
  name: "site",
  mode: "default",
  match: ["https://www.site-1.com"],
  state: {
    frontity: {
      url: "https://site.com",
      prop1: "prop1",
      menu1: ["item1"],
    },
  },
  packages: [
    {
      name: "package1",
      active: true,
      state: {
        frontity: {
          prop1: "overwritten by package1",
          menu1: ["item2", "item3"],
        },
        package1: {
          prop2: "prop2",
        },
      },
    },
    {
      name: "package2",
      active: true,
      state: {
        frontity: {
          prop1: "overwritten by package2",
        },
        package2: {
          prop3: "prop2",
        },
      },
    },
  ],
};

describe("initialState", () => {
  it("should return a valid initial state", () => {
    const url = new URL("https://site.com/post");
    expect(initialState({ settings, url })).toMatchSnapshot();
  });

  it("should return a valid initial link", () => {
    const url = new URL("https://site.com/category/nature/page/2");
    expect(initialState({ settings, url }).frontity.initialLink).toBe(
      "/category/nature/page/2"
    );
  });

  it("should return a valid initial link with home", () => {
    const url = new URL("https://site.com");
    expect(initialState({ settings, url }).frontity.initialLink).toBe("/");
  });

  it("should return a valid initial link with query", () => {
    const url = new URL("https://site.com/page/2?some=query");
    expect(initialState({ settings, url }).frontity.initialLink).toBe(
      "/page/2?some=query"
    );
  });

  it("should return a valid initial link with hash", () => {
    const url = new URL("https://site.com/page/2#some-hash");
    expect(initialState({ settings, url }).frontity.initialLink).toBe(
      "/page/2#some-hash"
    );
  });

  it("should return a valid initial link with query and hash", () => {
    const url = new URL("https://site.com/page/2?some=query#some-hash");
    expect(initialState({ settings, url }).frontity.initialLink).toBe(
      "/page/2?some=query#some-hash"
    );
  });

  it("should return a ssr rendering on the server", () => {
    const url = new URL("https://site.com/page/2?some=query#some-hash");
    expect(initialState({ settings, url }).frontity.rendering).toBe("ssr");
  });

  it("should return a server platform on the server", () => {
    const url = new URL("https://site.com/page/2?some=query#some-hash");
    expect(initialState({ settings, url }).frontity.platform).toBe("server");
  });

  it("should set the frontity.options correctly", () => {
    const url = new URL(
      "https://site.com/page/2?frontity_name=some-site&frontity_source_auth=some-token"
    );

    // The frontity_name & frontity_source_auth should be present in the options
    expect(initialState({ settings, url }).frontity.options)
      .toMatchInlineSnapshot(`
      Object {
        "name": "some-site",
        "sourceAuth": "some-token",
      }
    `);
  });

  it("should remove frontity_name & frontity_source_auth from the initialLink", () => {
    const url = new URL(
      "https://site.com/page/2?frontity_name=mySite&otherParam=value&frontity_source_auth=hello"
    );

    // The frontity_name & frontity_source_auth should be removed but `otherParam` should not!
    expect(initialState({ settings, url }).frontity.initialLink).toBe(
      "/page/2?otherParam=value"
    );
  });
});
