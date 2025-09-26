"use client";

import { useResumeStore } from "@/store/resume";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@resume-platform/ui/components/Card";
import { Input } from "@resume-platform/ui/components/Input";
import { Label } from "@resume-platform/ui/components/Label";
import { Textarea } from "@resume-platform/ui/components/Textarea";

export function BasicsForm() {
  const { basics, updateBasics } = useResumeStore((state) => ({
    basics: state.resume.basics,
    updateBasics: state.updateBasics,
  }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateBasics({ [name]: value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateBasics({
      location: {
        ...basics.location,
        [name]: value,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={basics.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              name="label"
              value={basics.label}
              onChange={handleChange}
              placeholder="Software Engineer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={basics.email}
              onChange={handleChange}
              placeholder="john.doe@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={basics.phone}
              onChange={handleChange}
              placeholder="(123) 456-7890"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">Website</Label>
          <Input
            id="url"
            name="url"
            value={basics.url}
            onChange={handleChange}
            placeholder="https://johndoe.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            name="summary"
            value={basics.summary}
            onChange={handleChange}
            placeholder="A brief summary about yourself..."
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={basics.location.address}
              onChange={handleLocationChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={basics.location.city}
              onChange={handleLocationChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">State/Region</Label>
            <Input
              id="region"
              name="region"
              value={basics.location.region}
              onChange={handleLocationChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={basics.location.postalCode}
              onChange={handleLocationChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}