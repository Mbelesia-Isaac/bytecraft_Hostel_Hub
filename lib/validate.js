const VALID_PROPERTY_TYPES = [
  "BEDSITTER", "HOSTEL_ROOM", "ONE_BEDROOM", "TWO_BEDROOM", "APARTMENT", "BUNGALOW",
];

export function validateListingInput(body) {
  const errors = [];

  if (!body.title || body.title.trim().length < 5) {
    errors.push("Title must be at least 5 characters.");
  }
  if (!body.description || body.description.trim().length < 10) {
    errors.push("Description must be at least 10 characters.");
  }
  if (!VALID_PROPERTY_TYPES.includes(body.propertyType)) {
    errors.push(`propertyType must be one of: ${VALID_PROPERTY_TYPES.join(", ")}`);
  }
  const price = Number(body.price);
  if (!price || price <= 0 || price > 10_000_000) {
    errors.push("price must be a positive number.");
  }
  if (!body.county || !body.area) {
    errors.push("county and area are required.");
  }

  return errors;
}
