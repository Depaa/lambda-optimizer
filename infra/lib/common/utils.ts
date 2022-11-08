
import { aws_ec2 as ec2 } from 'aws-cdk-lib';
import { Aspects, Tag } from 'aws-cdk-lib';

export function name(id: string, name?: string): string {
  return name ? `${id}-${name}` : id;
}

/*
* subnetNameTagger(id, vpc.publicSubnets);
*/
export function subnetNameTagger(name: string, subnets: ec2.ISubnet[]) {
  for (const subnet of subnets) {
    const az = subnet.availabilityZone.replace(subnet.env.region, '');
    Aspects.of(subnet).add(
      new Tag(
        'Name',
        `${name}-${subnet.node.id.replace(/Subnet[0-9]$/, '').toLowerCase()}-${az}`,
      ),
    );
  }
}