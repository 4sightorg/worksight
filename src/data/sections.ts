export type Section = {
  title: string,
  url: string
  isActive?: boolean
}

export type SectionGroup = {
  title: string,
  url: string,
  items: Section[]
}

type SectionData = {
  parts: string[],
  sections: SectionGroup[]
  defaultPart: string
  defaultSection: string
  defaultSectionIndex?: number
}

export const sections: SectionData = {
  parts: ["Employee", "Manager", "C-suite"],
  sections: [
    {
      title: "Tasks",
      url: "",
      items: [{
        title: "Tasks",
        url: "",
        isActive: false
      }, {
        title: "UnTask",
        url: "",
        isActive: false
      }]
    }
  ],
  defaultPart: "Employee",
  defaultSection: "Tasks",
  defaultSectionIndex: 0
}
