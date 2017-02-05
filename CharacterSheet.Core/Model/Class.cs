﻿using System.Collections.Generic;
using CharacterSheet.Core.Enums;

namespace CharacterSheet.Core.Model
{
    public class Class
    {
        public int classId { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string primaryability { get; set; }
        public string hitdieperlevel { get; set; }
        public string hpatfirstlevel { get; set; }
        public string hpathigherlevels { get; set; }
        public virtual IList<Proficiencies> Proficiencies { get; set; }
    }
}
