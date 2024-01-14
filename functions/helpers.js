export function createImageURL(image, size = "medium") {
  const baseURL = process.env.BASE_URL;

  if (image) {
    const local = baseURL.includes("localhost");
    const { formats } = image;
   
    const version = formats && formats[size];
    const { url } = version || image;

    if (local) {
      if (url) {
        return `${baseURL}${url.slice(1)}`;
      }
    } else {
      return `${url}`;
    }
  }

  return "";
}

export function removeNullValues(data, cannotBe = [null, ""]) {
  if (Array.isArray(data)) {
    console.warn("Removing null values from Array", data);
    return data.filter((value) => !cannotBe.includes(value));
  }

  const cleanData = {};
  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (!cannotBe.includes(value)) {
      cleanData[key] = value;
    }

    if (Array.isArray(value)) {
      const shouldConvert = [
        "commission_types",
        "down_pipes_level",
        "gutter_level"
      ];
      console.log("Found Array", key, value, shouldConvert.includes(key));
      if (shouldConvert.includes(key)) {
        cleanData[key] = value.join(",");
      }
    }
  });
  return cleanData;
}

export function pickValueFromObject(form) {
  const cleanData = {};
  const isObject = (val) => typeof val === "object";
  Object.keys(form).forEach((key) => {
    let value = form[key];
    if (Array.isArray(value)) {
      console.log(key, value);
      if (key === "attendees") {
        value = value
          .map(({ firstName, lastName }) => `${firstName} ${lastName}`.trim())
          .join(", ");
      }
      if (key === "plots") {
        value = value.map(({ name }) => name).join(", ");
      }
    }
    if (value && isObject(value)) {
      const { id, name, firstName, lastName, signature } = value;
      const fullName =
        firstName || lastName ? `${firstName} ${lastName}` : null;
      const hasSignature = value.url
        ? value
        : signature && signature.url
        ? signature
        : null;
      value = hasSignature || name || fullName || id;
    }

    cleanData[key] = value;
  });
  return cleanData;
}

export const formatQueryString = (inputObject, ignoreValue = "*") => {
  const filters = Object.keys(inputObject).filter(
    (key) => inputObject[key] !== ignoreValue
  );

  const filterString = filters.reduce((prev, curr, i) => {
    const key = filters[i];
    const value = inputObject[key];
    const prefix = i === 0 ? "?" : "&";
    return prev + prefix + key + "=" + encodeURIComponent(value);
  }, "");

  return filterString;
};

export const formulateMap = (
  arr,
  propOfInterest = "id",
  defaultValue = { label: "All", value: "*" }
) => {
  return [
    defaultValue,
    ...arr
      .map((item) => ({
        label: item.name || item.username || "",
        value: `${item[propOfInterest]}`
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  ];
};

export const alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z"
];

// Usage getAllFieldNames.apply(this, [params]);
export function getAllFieldNames(apis) {
  const data = apis.map((form) => {
    console.log(form.api);
    this.$axios.get(form.api).then(({ data }) => {
      const d = data.items ? data.items : data;
      console.log(`Data for ${form.api}`, Object.keys(d[0]));
    });
  });
  return data;
}

// https://blog.logrocket.com/programmatic-file-downloads-in-the-browser-9a5186298d5c/
export function downloadBlob(blob, filename) {
  // Create an object URL for the blob object
  const url = URL.createObjectURL(blob);

  // Create a new anchor element
  const a = document.createElement("a");

  // Set the href and download attributes for the anchor element
  // You can optionally set other attributes like `title`, etc
  // Especially, if the anchor element will be attached to the DOM
  a.href = url;
  a.download = filename || "download";

  // Click handler that releases the object URL after the element has been clicked
  // This is required for one-off downloads of the blob content
  const clickHandler = () => {
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.removeEventListener("click", clickHandler);
    }, 150);
  };

  // Add the click event listener on the anchor element
  // Comment out this line if you don't want a one-off download of the blob content
  a.addEventListener("click", clickHandler, false);

  // Programmatically trigger a click on the anchor element
  // Useful if you want the download to happen automatically
  // Without attaching the anchor element to the DOM
  // Comment out this line if you don't want an automatic download of the blob content
  a.click();

  // Return the anchor element
  // Useful if you want a reference to the element
  // in order to attach it to the DOM or use it in some other way
  return a;
}
