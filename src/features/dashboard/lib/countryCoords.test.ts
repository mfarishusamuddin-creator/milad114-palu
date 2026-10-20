import { describe, expect, it } from "vitest";
import { lookupCountryCoords } from "./countryCoords";

describe("lookupCountryCoords", () => {
  it("mengenali kode ISO-3166-1 alpha-2, case-insensitive", () => {
    expect(lookupCountryCoords("id")).toEqual({ lat: -2.5, lng: 118 });
    expect(lookupCountryCoords("ID")).toEqual({ lat: -2.5, lng: 118 });
    expect(lookupCountryCoords("Id")).toEqual({ lat: -2.5, lng: 118 });
    expect(lookupCountryCoords("my")).not.toBeNull();
    expect(lookupCountryCoords("sg")).not.toBeNull();
    expect(lookupCountryCoords("us")).not.toBeNull();
    expect(lookupCountryCoords("gb")).not.toBeNull();
    expect(lookupCountryCoords("jp")).not.toBeNull();
  });

  it("mengenali nama Inggris & Indonesia, case-insensitive + spasi ekstra", () => {
    expect(lookupCountryCoords("indonesia")).toEqual({ lat: -2.5, lng: 118 });
    expect(lookupCountryCoords("Indonesia")).toEqual({ lat: -2.5, lng: 118 });
    expect(lookupCountryCoords("  INDONESIA  ")).toEqual({ lat: -2.5, lng: 118 });
    expect(lookupCountryCoords("indonesia  raya")).toBeNull(); // spasi internal bukan wildcard
    expect(lookupCountryCoords("malaysia")).not.toBeNull();
    expect(lookupCountryCoords("singapore")).toEqual(lookupCountryCoords("singapura"));
    expect(lookupCountryCoords("united states")).toEqual(lookupCountryCoords("usa"));
    expect(lookupCountryCoords("United  States")).toEqual(lookupCountryCoords("usa"));
    expect(lookupCountryCoords("united kingdom")).toEqual(lookupCountryCoords("uk"));
    expect(lookupCountryCoords("turkiye")).toEqual(lookupCountryCoords("turkey"));
    expect(lookupCountryCoords("turkiye")).toEqual(lookupCountryCoords("turki"));
    expect(lookupCountryCoords("germany")).toEqual(lookupCountryCoords("jerman"));
    expect(lookupCountryCoords("japan")).toEqual(lookupCountryCoords("jepang"));
    expect(lookupCountryCoords("saudi arabia")).toEqual(lookupCountryCoords("arab saudi"));
    expect(lookupCountryCoords("egypt")).toEqual(lookupCountryCoords("mesir"));
    expect(lookupCountryCoords("netherlands")).toEqual(lookupCountryCoords("belanda"));
    expect(lookupCountryCoords("australia")).not.toBeNull();
    expect(lookupCountryCoords("amerika serikat")).toEqual(lookupCountryCoords("us"));
    expect(lookupCountryCoords("inggris")).toEqual(lookupCountryCoords("gb"));
    expect(lookupCountryCoords("prancis")).toEqual(lookupCountryCoords("france"));
  });

  it("unknown → null (pemanggil skip + diagnostic, bukan koordinat tebakan)", () => {
    expect(lookupCountryCoords("wakanda")).toBeNull();
    expect(lookupCountryCoords("")).toBeNull();
    expect(lookupCountryCoords("   ")).toBeNull();
    expect(lookupCountryCoords("zz")).toBeNull();
    expect(lookupCountryCoords("idn")).toBeNull(); // alpha-3 tidak didukung v1
  });

  it("semua koordinat dalam rentang geografis valid", () => {
    const inputs = ["id", "my", "sg", "us", "gb", "jp", "sa", "eg", "tr", "de", "nl", "au", "br", "za", "ru", "nz"];
    for (const input of inputs) {
      const coords = lookupCountryCoords(input);
      expect(coords, `koordinat ${input}`).not.toBeNull();
      if (!coords) continue;
      expect(coords.lat).toBeGreaterThanOrEqual(-90);
      expect(coords.lat).toBeLessThanOrEqual(90);
      expect(coords.lng).toBeGreaterThanOrEqual(-180);
      expect(coords.lng).toBeLessThanOrEqual(180);
    }
  });

  it("mencakup >= 50 kode ISO negara umum", () => {
    const codes =
      "id my sg th vn ph kh la mm bn tl cn jp kr kp in pk bd lk np af uz kz sa ae qa kw bh om ye jo lb sy iq ir il tr eg ly dz ma ng ke za us ca mx br ar gb ie fr es pt it de nl be ch at pl se no dk fi ru ua gr au nz".split(
        " ",
      );
    expect(codes.length).toBeGreaterThanOrEqual(50);
    for (const code of codes) {
      expect(lookupCountryCoords(code), `kode ${code}`).not.toBeNull();
    }
  });
});
